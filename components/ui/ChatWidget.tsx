"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

import type { ChatMessage } from "@/types/chat";

// Works in production (bluelayersystems.com).
// CORS blocks localhost — expected in dev. Deploy to test live.
const WORKER_URL =
  "https://empty-fire-57ca-bls-chat-worker.ferencz-mihai9.workers.dev";

const OPENING_CONTENT =
  "> SYSTEM ONLINE. Ask me about Mihai's stack, projects, availability, or anything infrastructure-related.";

function makeOpeningMessage(): ChatMessage {
  return { role: "assistant", content: OPENING_CONTENT, ts: new Date() };
}

function useIsMobile(): boolean {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const sync = () => setMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return mobile;
}

function parseWorkerReply(data: unknown): string {
  if (typeof data !== "object" || data === null)
    throw new Error("Invalid response shape");
  if (!("reply" in data)) throw new Error("Invalid response shape");
  const reply = (data as { reply: unknown }).reply;
  if (typeof reply !== "string") throw new Error("Invalid response shape");
  return reply;
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-3 py-2" aria-hidden>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="rounded-full"
          style={{ width: 6, height: 6, background: "var(--accent)" }}
          animate={{ scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

function ChatIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [showTooltip, setShowTooltip] = useState(false);
  const listEndRef = useRef<HTMLDivElement | null>(null);
  const constraintsRef = useRef<HTMLDivElement | null>(null);
  const mobile = useIsMobile();

  useEffect(() => {
    if (!isOpen) return;
    setMessages((prev) => (prev.length > 0 ? prev : [makeOpeningMessage()]));
  }, [isOpen]);

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const send = useCallback(async () => {
    const trimmed = inputValue.trim();
    if (trimmed === "" || isLoading) return;

    const userMsg: ChatMessage = { role: "user", content: trimmed, ts: new Date() };

    const updatedMessages: ChatMessage[] = messages.length === 0
      ? [makeOpeningMessage(), userMsg]
      : [...messages, userMsg];

    setMessages(updatedMessages);
    setInputValue("");
    setIsLoading(true);

    const payload = {
      messages: updatedMessages.map(({ role, content }) => ({ role, content })),
    };
    console.log("Sending payload:", JSON.stringify(payload));

    try {
      const res = await fetch(WORKER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const raw: unknown = await res.json();
      if (!res.ok) throw new Error(`Worker error: ${res.status}`);

      const reply = parseWorkerReply(raw);
      setMessages((prev) => [...prev, { role: "assistant", content: reply, ts: new Date() }]);
    } catch (err) {
      const isCorsOrNetwork = err instanceof TypeError;
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: isCorsOrNetwork
            ? "> ASSISTANT OFFLINE IN DEV MODE — deploy to bluelayersystems.com to activate. Worker URL is configured and will work in production."
            : "> CONNECTION_ERROR — retry or use the contact section.",
          ts: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, isLoading, messages]);

  const panelStyle = mobile
    ? { bottom: 0, right: 0, width: "100vw", height: "80vh" as const }
    : { bottom: 100, right: 28, width: 360, height: 500 };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .bls-chat-messages::-webkit-scrollbar { width: 2px; }
        .bls-chat-messages::-webkit-scrollbar-thumb { background: var(--border-hi); }
        .bls-drag-header { cursor: grab; }
        .bls-drag-header:active { cursor: grabbing; }
      ` }} />

      {/* Full-viewport ref for drag constraints */}
      <div
        ref={constraintsRef}
        style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 8999 }}
      />

      {/* FAB toggle button */}
      <div
        style={{ position: "fixed", bottom: 28, right: 28, zIndex: 9000 }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <AnimatePresence>
          {showTooltip && !isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.15 }}
              style={{
                position: "absolute",
                bottom: "calc(100% + 10px)",
                right: 0,
                background: "var(--bg-panel)",
                border: "1px solid var(--border-hi)",
                color: "var(--text)",
                fontFamily: "var(--font-mono, monospace)",
                fontSize: "0.6rem",
                letterSpacing: "0.1em",
                padding: "4px 10px",
                whiteSpace: "nowrap",
                pointerEvents: "none",
              }}
            >
              BLS Assistant
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          type="button"
          aria-expanded={isOpen}
          aria-controls="bls-chat-panel"
          aria-label={isOpen ? "Close BLS Assistant" : "Open BLS Assistant"}
          onClick={() => setIsOpen((o) => !o)}
          whileHover={{
            scale: 1.08,
            boxShadow: "0 6px 28px rgba(0,204,106,0.6)",
          }}
          whileTap={{ scale: 0.95 }}
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "var(--accent)",
            color: "var(--bg)",
            border: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 4px 20px rgba(0,204,106,0.4)",
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isOpen ? (
              <motion.span
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
                style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <CloseIcon />
              </motion.span>
            ) : (
              <motion.span
                key="chat"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.15 }}
                style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
              >
                <ChatIcon />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen ? (
          <motion.div
            id="bls-chat-panel"
            role="dialog"
            aria-modal="true"
            aria-label="BLS Assistant chat"
            drag={!mobile}
            dragMomentum={false}
            dragElastic={0}
            dragConstraints={constraintsRef}
            className="fixed z-[9000] flex flex-col overflow-hidden font-mono"
            style={{
              ...panelStyle,
              border: "1px solid var(--border-hi)",
              background: "var(--bg-panel)",
              boxShadow: "var(--panel-shadow-hover)",
              clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)",
            }}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <header
              className="bls-drag-header flex h-11 shrink-0 items-center justify-between border-b border-[var(--border)] px-3"
              style={{ background: "rgba(0,0,0,0.3)" }}
            >
              <div className="flex items-center gap-2">
                <span
                  aria-hidden
                  style={{
                    fontSize: "1.1rem",
                    color: "var(--muted)",
                    lineHeight: 1,
                    userSelect: "none",
                  }}
                >
                  ⠿
                </span>
                <span className="text-[0.65rem] text-[var(--accent)]">
                  {"// BLS ASSISTANT"}
                </span>
              </div>
              <button
                type="button"
                className="px-2 py-1 text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
                aria-label="Close chat"
                onClick={() => setIsOpen(false)}
              >
                ✕
              </button>
            </header>

            <div
              className="bls-chat-messages flex flex-1 flex-col gap-3 overflow-y-auto p-3"
              style={{ scrollbarWidth: "thin", scrollbarColor: "var(--border-hi) transparent" }}
            >
              {messages.map((m, idx) => (
                <motion.div
                  key={`${m.role}-${idx}-${m.ts.getTime()}`}
                  className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
                  initial={{ y: 8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <div
                    className="max-w-[85%] px-2.5 py-2 text-[0.72rem] leading-[1.5]"
                    style={{
                      background: m.role === "user" ? "var(--accent-dim)" : "var(--bg-card)",
                      color: m.role === "user" ? "var(--accent)" : "var(--text)",
                    }}
                  >
                    {m.content}
                  </div>
                  <span className="mt-1 text-[0.55rem] text-[var(--muted)]">
                    {m.ts.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </motion.div>
              ))}
              {isLoading ? <TypingIndicator /> : null}
              <div ref={listEndRef} />
            </div>

            <div className="shrink-0 border-t border-[var(--border)] p-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  className="min-w-0 flex-1 border border-[var(--border)] bg-[var(--bg-card)] px-2.5 py-1.5 font-mono text-[0.72rem] text-[var(--text)] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none"
                  placeholder="QUERY_INPUT..."
                  value={inputValue}
                  disabled={isLoading}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      void send();
                    }
                  }}
                />
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => void send()}
                  className="shrink-0 border border-[var(--accent)] bg-transparent px-3.5 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.15em] text-[var(--accent)] transition-colors hover:bg-[var(--accent)] hover:text-[var(--bg)] disabled:pointer-events-none disabled:opacity-50"
                  style={{
                    clipPath: "polygon(0 0, 100% 0, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0 100%)",
                  }}
                >
                  Send
                </button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
