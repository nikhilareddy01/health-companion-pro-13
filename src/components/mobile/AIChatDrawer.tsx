import { useState, useRef, useEffect } from "react";
import { MessageSquareCode, Send, Sparkles, X, User, HeartPulse, ShieldAlert, ArrowDown } from "lucide-react";
import { toast } from "sonner";
import { getApiUrl } from "@/utils/api";

interface Message {
  sender: "user" | "ai";
  text: string;
}

export function AIChatDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "Hi! I am Aura, your AI Health Companion. 🌟\n\nHow can I help you today? Tell me how you are feeling, or ask about tailored diet plans!",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest messages
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [messages, loading, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = inputText.trim();
    setInputText("");

    const updatedMessages = [...messages, { sender: "user", text: userMessage } as Message];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      // Structure the chat history for Gemini
      const history = updatedMessages.map((m) => ({
        role: m.sender === "user" ? "user" : "model",
        parts: [{ text: m.text }],
      }));

      const response = await fetch(getApiUrl("/api/ai/chat"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history }),
      });

      if (!response.ok) {
        throw new Error("Chat request failed");
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { sender: "ai", text: data.text }]);
    } catch (err) {
      console.error(err);
      
      // Local fallback
      let localReply = "I understand. Please try to get plenty of rest and stay hydrated. Can you tell me more about your symptoms?";
      const msgLower = userMessage.toLowerCase();
      if (msgLower.includes("headache") || msgLower.includes("fever")) {
        localReply = "For a fever or headache, stay hydrated. A soft-food diet like warm vegetable broth, ginger tea, and toast is recommended. *Disclaimer: I am an AI companion, not a doctor. Seek medical attention if symptoms persist.*";
      } else if (msgLower.includes("stomach") || msgLower.includes("nausea")) {
        localReply = "Sip warm ginger water and follow the BRAT diet (Bananas, Rice, Applesauce, Toast). Avoid fried or dairy items. *Disclaimer: Consult a doctor if you experience severe abdominal pain.*";
      } else if (msgLower.includes("throat") || msgLower.includes("cough")) {
        localReply = "To soothe a sore throat or cough, try warm honey water, hot broths, or decaf tea. *Disclaimer: If you develop any chest congestion, contact a doctor.*";
      }

      setMessages((prev) => [...prev, { sender: "ai", text: localReply }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Chat Bubble Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="absolute bottom-20 right-5 md:fixed md:bottom-6 md:right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full text-primary-foreground shadow-[var(--shadow-float)] hover:scale-105 transition-all duration-300 cursor-pointer animate-in fade-in zoom-in-50"
          style={{ background: "var(--gradient-primary)" }}
        >
          <MessageSquareCode className="h-6 w-6 animate-pulse" />
          <span className="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full bg-destructive border-2 border-background" />
        </button>
      )}

      {/* Drawer Overlay backdrop - only on mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="absolute inset-0 md:hidden z-40 bg-black/40 backdrop-blur-[2px] transition-all duration-300 animate-in fade-in"
        />
      )}

      {/* Slide-up Chat Drawer Panel */}
      <div
        className={`absolute bottom-0 left-0 right-0 md:fixed md:bottom-24 md:right-6 md:left-auto md:w-96 md:h-[540px] md:max-h-[85vh] md:min-h-[400px] md:rounded-2xl md:border md:border-border z-50 flex max-h-[80%] min-h-[50%] flex-col rounded-t-3xl border-t border-border bg-background shadow-[0_-10px_45px_-5px_oklch(0.55_0.12_175/0.15)] md:shadow-2xl transition-all duration-300 ease-out ${
          isOpen ? "translate-y-0" : "translate-y-full md:translate-y-[120%] md:opacity-0"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-border/40 px-5 py-4 bg-muted/20">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary-soft text-primary">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Aura AI Health Companion</p>
              <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                <HeartPulse className="h-2.5 w-2.5 text-primary" /> Active virtual clinical coach
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-foreground transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Message Log */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 hide-scrollbar bg-gradient-to-b from-transparent to-muted/10">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-2.5 ${
                m.sender === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                  m.sender === "user"
                    ? "bg-secondary text-secondary-foreground"
                    : "bg-primary-soft text-primary"
                }`}
              >
                {m.sender === "user" ? <User className="h-3.5 w-3.5" /> : <Sparkles className="h-3.5 w-3.5" />}
              </div>
              <div
                className={`rounded-2xl px-3.5 py-2.5 text-xs max-w-[80%] whitespace-pre-wrap leading-relaxed shadow-[var(--shadow-soft)] ${
                  m.sender === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-none"
                    : "bg-card text-foreground rounded-tl-none border border-border/40"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-start gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-soft text-primary">
                <Sparkles className="h-3.5 w-3.5 animate-spin" />
              </div>
              <div className="rounded-2xl rounded-tl-none border border-border/40 bg-card px-4 py-2.5 text-xs text-muted-foreground flex gap-1 items-center shadow-[var(--shadow-soft)]">
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Dynamic prompt suggestion chips */}
        {messages.length === 1 && (
          <div className="px-5 pb-2 flex gap-1.5 overflow-x-auto hide-scrollbar shrink-0">
            {[
              "I feel feverish",
              "Suggest lunch diet",
              "Insulin interaction tips"
            ].map((chip) => (
              <button
                key={chip}
                onClick={() => setInputText(chip)}
                className="shrink-0 rounded-full bg-card border border-border/60 px-3 py-1 text-[10px] text-muted-foreground hover:bg-muted/30 transition cursor-pointer"
              >
                {chip}
              </button>
            ))}
          </div>
        )}

        {/* Input Form Area */}
        <form
          onSubmit={handleSend}
          className="border-t border-border/40 bg-card p-3 flex gap-2 items-center shrink-0"
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type how you feel..."
            className="flex-1 bg-muted px-4 py-2 rounded-xl text-xs outline-none text-foreground focus:ring-1 focus:ring-primary transition"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={!inputText.trim() || loading}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/95 disabled:opacity-30 transition cursor-pointer"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>
      </div>
    </>
  );
}
