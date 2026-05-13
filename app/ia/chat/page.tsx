"use client";

import { useRef, useEffect, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, isTextUIPart } from "ai";
import { ArrowLeft, Send, BrainCircuit, Loader2, AlertTriangle, RotateCcw } from "lucide-react";
import Link from "next/link";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { cn } from "@/lib/utils";

const SUGESTOES = [
  "Quais são as interações mais importantes do lítio?",
  "Como diferenciar depressão bipolar de unipolar?",
  "Dose inicial de quetiapina para depressão bipolar?",
  "Critérios de síndrome serotoninérgica de Hunter",
  "Quando indicar clozapina na esquizofrenia?",
  "Manejo de akathisia por antipsicóticos",
];

export default function ChatIAPage() {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/ia/chat" }),
  });

  const isStreaming = status === "streaming" || status === "submitted";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSend() {
    const text = input.trim();
    if (!text || isStreaming) return;
    sendMessage({ text });
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  function autoResize(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";
  }

  return (
    <AuthGuard>
      <DashboardLayout>
        <div className="flex flex-col h-[calc(100vh-8rem)] max-w-2xl">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4 shrink-0">
            <Link
              href="/ia"
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-border text-muted-foreground hover:text-foreground transition-colors shrink-0"
            >
              <ArrowLeft size={16} />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-violet-500 to-purple-600">
                <BrainCircuit size={16} className="text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">Chat Clínico</p>
                <p className="text-[10px] text-muted-foreground">Apoio à decisão · MindDoctor AI</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 pb-2">
            {messages.length === 0 && (
              <div className="space-y-4 pt-4">
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                    <BrainCircuit size={22} className="text-white" />
                  </div>
                  <p className="text-sm font-semibold text-foreground">Como posso ajudar?</p>
                  <p className="text-xs text-muted-foreground">Tire dúvidas de farmacologia, diagnóstico e condutas em psiquiatria</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SUGESTOES.map((s) => (
                    <button
                      key={s}
                      onClick={() => { setInput(s); textareaRef.current?.focus(); }}
                      className="text-left text-xs px-3 py-2.5 rounded-xl border border-border bg-card hover:border-primary/30 hover:bg-muted/30 transition-all text-foreground leading-snug"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg) => {
              const isUser = msg.role === "user";
              const text = msg.parts.filter(isTextUIPart).map((p) => p.text).join("");
              return (
                <div key={msg.id} className={cn("flex", isUser ? "justify-end" : "justify-start")}>
                  <div className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                    isUser
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-card border border-border text-foreground rounded-bl-sm"
                  )}>
                    {isUser ? (
                      <p className="whitespace-pre-wrap">{text}</p>
                    ) : (
                      <div className="prose prose-sm prose-invert max-w-none whitespace-pre-wrap">
                        {text}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isStreaming && messages[messages.length - 1]?.role === "user" && (
              <div className="flex justify-start">
                <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3">
                  <Loader2 size={14} className="text-muted-foreground animate-spin" />
                </div>
              </div>
            )}

            {error && (
              <div className="flex gap-2 items-start bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-2.5 text-xs text-red-600">
                <AlertTriangle size={13} className="shrink-0 mt-0.5" />
                <span>Erro ao conectar com a IA. Verifique sua conexão ou tente novamente.</span>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Disclaimer */}
          <p className="text-[10px] text-muted-foreground/60 text-center shrink-0 py-1">
            ⚠️ Apoio clínico — não substitui avaliação médica presencial
          </p>

          {/* Input */}
          <div className="shrink-0 bg-card border border-border rounded-2xl p-3 flex gap-2 items-end mt-1">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={autoResize}
              onKeyDown={handleKeyDown}
              placeholder="Digite sua dúvida clínica..."
              rows={1}
              className="flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none leading-relaxed max-h-[120px]"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isStreaming}
              className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all",
                input.trim() && !isStreaming
                  ? "bg-primary text-primary-foreground hover:opacity-90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              )}
            >
              {isStreaming ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            </button>
          </div>
        </div>
      </DashboardLayout>
    </AuthGuard>
  );
}
