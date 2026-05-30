"use client";

import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { MessageSquare, X, Send } from "lucide-react";
import type { ChatMessage } from "@/types/chat";

const WORKER_URL =
  process.env.NEXT_PUBLIC_WORKER_URL ??
  "https://empty-fire-57ca-bls-chat-worker.ferencz-mihai9.workers.dev";

const OPENING =
  "SYSTEM ONLINE. Ask me about Mihai's stack, projects, availability, or anything infrastructure-related.";

function makeOpening(): ChatMessage {
  return { role: "assistant", content: OPENING, ts: new Date() };
}

function parseReply(data: unknown): string {
  if (typeof data !== "object" || data === null) throw new Error("bad shape");
  if (!("reply" in data)) throw new Error("bad shape");
  const r = (data as { reply: unknown }).reply;
  if (typeof r !== "string") throw new Error("bad shape");
  return r;
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-3 py-2" aria-hidden>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="rounded-full bg-[var(--nebula-cyan)]"
          style={{ width: 5, height: 5 }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [showTip, setShowTip] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const constraintsRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([makeOpening()]);
    }
  }, [open, messages.length]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessage = { role: "user", content: trimmed, ts: new Date() };
    const history =
      messages.length === 0 ? [makeOpening(), userMsg] : [...messages, userMsg];

    setMessages(history);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: history.map(({ role, content }) => ({ role, content })),
        }),
      });
      const raw: unknown = await res.json();
      if (!res.ok) throw new Error(`${res.status}`);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: parseReply(raw), ts: new Date() },
      ]);
    } catch (err) {
      const offline = err instanceof TypeError;
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: offline
            ? "ASSISTANT OFFLINE IN DEV — deploy to bluelayersystems.com to activate."
            : "CONNECTION_ERROR — retry or use the contact section.",
          ts: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages]);

  const panelStyle = isMobile
    ? { bottom: 0, right: 0, width: "100vw", height: "75vh" as const, borderRadius: "12px 12px 0 0" }
    : { bottom: 88, right: 24, width: 360, height: 500, borderRadius: 12 };

  return (
    <>
      {/* Drag constraint layer */}
      <div
        ref={constraintsRef}
        style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 8999 }}
      />

      {/* FAB */}
      <div
        style={{ position: "fixed", bottom: 24, right: 24, zIndex: 9000 }}
        onMouseEnter={() => setShowTip(true)}
        onMouseLeave={() => setShowTip(false)}
      >
        <AnimatePresence>
          {showTip && !open && (
            <motion.div
              initial={{ opacity: 0, y: 4, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              style={{
                position: "absolute",
                bottom: "calc(100% + 10px)",
                right: 0,
                whiteSpace: "nowrap",
              }}
              className="bg-[var(--cosmos-deep)] border border-[var(--nebula-cyan)] text-[var(--nebula-cyan)] font-mono text-[10px] tracking-widest px-3 py-1.5 rounded"
            >
              ASK BLS ASSISTANT
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          data-cursor="hover"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close chat" : "Open BLS Assistant"}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className="relative w-14 h-14 rounded-full flex items-center justify-center border border-[var(--nebula-cyan)] bg-[var(--cosmos-deep)] text-[var(--nebula-cyan)] shadow-glow-cyan overflow-hidden"
        >
          {/* Pulse ring */}
          {!open && (
            <motion.span
              className="absolute inset-0 rounded-full border border-[var(--nebula-cyan)]"
              animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            />
          )}
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <X size={20} />
              </motion.span>
            ) : (
              <motion.span
                key="chat"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <MessageSquare size={20} />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            drag={!isMobile}
            dragMomentum={false}
            dragConstraints={constraintsRef}
            dragElastic={0}
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            style={{
              position: "fixed",
              zIndex: 9000,
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              ...panelStyle,
              background: "rgba(6, 13, 26, 0.92)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(0, 212, 255, 0.25)",
              boxShadow: "0 0 40px rgba(0, 212, 255, 0.08), 0 25px 50px rgba(0,0,0,0.6)",
            }}
          >
            {/* Header */}
            <div
              className="bls-drag-handle flex items-center justify-between h-11 px-4 border-b border-[var(--border-subtle)] flex-shrink-0"
              style={{ background: "rgba(0, 0, 0, 0.3)", cursor: isMobile ? "default" : "grab" }}
            >
              <div className="flex items-center gap-2">
                <motion.span
                  className="w-2 h-2 rounded-full bg-[var(--nebula-cyan)]"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span className="font-mono text-[10px] tracking-[0.2em] text-[var(--nebula-cyan)]">
                  BLS ASSISTANT
                </span>
              </div>
              <button
                onClick={() => setOpen(false)}
                data-cursor="hover"
                className="text-[var(--text-muted)] hover:text-[var(--nebula-cyan)] transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {/* Messages */}
            <div
              className="flex-1 overflow-y-auto p-4 space-y-3"
              style={{ scrollbarWidth: "thin", scrollbarColor: "var(--cosmos-surface) transparent" }}
            >
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className="max-w-[85%] px-3 py-2 font-mono text-xs leading-relaxed rounded"
                    style={
                      m.role === "user"
                        ? {
                            background: "rgba(0, 212, 255, 0.12)",
                            border: "1px solid rgba(0, 212, 255, 0.25)",
                            color: "var(--nebula-cyan)",
                          }
                        : {
                            background: "rgba(255, 255, 255, 0.04)",
                            border: "1px solid var(--border-subtle)",
                            color: "var(--text-primary)",
                          }
                    }
                  >
                    {m.content}
                  </div>
                  <span className="mt-1 text-[9px] font-mono text-[var(--text-muted)]">
                    {m.ts.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </motion.div>
              ))}
              {loading && <TypingDots />}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <div className="flex-shrink-0 border-t border-[var(--border-subtle)] p-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 min-w-0 bg-[var(--cosmos-mid)] border border-[var(--border-subtle)] rounded px-3 py-2 font-mono text-xs text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--nebula-cyan)] transition-colors"
                  placeholder="QUERY_INPUT..."
                  value={input}
                  disabled={loading}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      void send();
                    }
                  }}
                />
                <button
                  type="button"
                  disabled={loading || !input.trim()}
                  data-cursor="hover"
                  onClick={() => void send()}
                  className="flex-shrink-0 w-9 h-9 flex items-center justify-center border border-[var(--nebula-cyan)] text-[var(--nebula-cyan)] rounded hover:bg-[var(--nebula-cyan)] hover:text-[var(--cosmos-void)] transition-all duration-200 disabled:opacity-40 disabled:pointer-events-none"
                >
                  <Send size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .bls-drag-handle:active { cursor: grabbing; }
      `}</style>
    </>
  );
}
