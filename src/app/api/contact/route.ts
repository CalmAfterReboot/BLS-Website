import { NextRequest, NextResponse } from "next/server";

const MAX_BODY_BYTES = 10_000;
const MAX_LEN = { name: 100, email: 200, message: 5_000 };
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Best-effort, per-instance rate limit. Serverless instances are ephemeral so
// this is a backstop, not a guarantee — robust limiting belongs at the edge
// (Cloudflare WAF / Turnstile). It still blunts a trivial single-source flood.
const WINDOW_MS = 10 * 60 * 1_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, { count: number; reset: number }>();

function clientIp(req: NextRequest): string {
  return (
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.reset) {
    hits.set(ip, { count: 1, reset: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_PER_WINDOW;
}

export async function POST(req: NextRequest) {
  try {
    if (isRateLimited(clientIp(req))) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    if (Number(req.headers.get("content-length") || 0) > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }

    const raw = await req.text();
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "Payload too large" }, { status: 413 });
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { name, email, message } = (parsed ?? {}) as {
      name?: unknown;
      email?: unknown;
      message?: unknown;
    };

    if (
      typeof name !== "string" ||
      typeof email !== "string" ||
      typeof message !== "string" ||
      !name.trim() ||
      !email.trim() ||
      !message.trim()
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (
      name.length > MAX_LEN.name ||
      email.length > MAX_LEN.email ||
      message.length > MAX_LEN.message
    ) {
      return NextResponse.json({ error: "Field too long" }, { status: 400 });
    }

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Forward to Resend (or just succeed silently if no key is configured).
    const resendKey = process.env.RESEND_API_KEY;

    if (resendKey) {
      // Strip CR/LF from the subject to avoid header injection.
      const safeSubject = `BLS Contact: ${name.replace(/[\r\n]+/g, " ").slice(0, 80)}`;
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${resendKey}`,
        },
        body: JSON.stringify({
          from: "BLS Portfolio <contact@bluelayersystems.com>",
          to: ["mihai.ferencz@bluelayersystems.com"],
          reply_to: email,
          subject: safeSubject,
          text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
        }),
      });

      if (!res.ok) {
        return NextResponse.json({ error: "Send failed" }, { status: 502 });
      }
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
