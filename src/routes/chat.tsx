import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, User, HelpCircle, HeartHandshake } from "lucide-react";
import { Screen } from "@/components/mobile/Screen";
import { toast } from "sonner";
import { getApiUrl } from "@/utils/api";

export const Route = createFileRoute("/chat")({ component: ChatPage });

interface Message {
  sender: "user" | "ai";
  text: string;
}

function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: "ai",
      text: "Hello! I am Aura, your AI Health Companion. 🌟\n\nHow are you feeling today? Please let me know what symptoms you have or if you are looking for diet suggestions!",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom of the chat list on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage = inputText.trim();
    setInputText("");
    
    // Add user message to local state
    const updatedMessages = [...messages, { sender: "user", text: userMessage } as Message];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      // Map frontend messages list to Gemini API history schema
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
      toast.error("Chat error. Using offline fallback...");
      
      // Local rule-based fallback if backend is down
      let localReply = "I understand. Make sure to stay hydrated and rest. Can you give me more details about your symptoms?";
      const msgLower = userMessage.toLowerCase();
      if (msgLower.includes("headache") || msgLower.includes("fever")) {
        localReply = "For a fever or headache, stay hydrated. A soft-food diet like warm chicken/vegetable broth, ginger tea, and toast is recommended. *Disclaimer: I am an AI virtual assistant. Please call a doctor if your temperature is very high.*";
      } else if (msgLower.includes("stomach") || msgLower.includes("nausea")) {
        localReply = "Sip warm ginger water and follow the BRAT diet (Bananas, Rice, Applesauce, Toast). Avoid fried or dairy items. *Disclaimer: Consult a doctor if you experience severe abdominal pain.*";
      } else if (msgLower.includes("throat") || msgLower.includes("cough")) {
        localReply = "Try drinking warm water with honey and lemon or hot soups. Avoid cold drinks. *Disclaimer: Seek medical attention if you have breathing difficulties.*";
      }

      setMessages((prev) => [...prev, { sender: "ai", text: localReply }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen title="Aura AI Chat" contentClass="flex flex-col h-[calc(100vh-140px)] px-5 pb-4">
      {/* Messages list container */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 py-4 hide-scrollbar">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2 duration-250 ${
              m.sender === "user" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            {/* Avatar */}
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                m.sender === "user"
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-primary-soft text-primary"
              }`}
            >
              {m.sender === "user" ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
            </div>

            {/* Bubble */}
            <div
              className={`rounded-2xl px-4 py-3 text-sm max-w-[80%] whitespace-pre-wrap leading-relaxed shadow-[var(--shadow-soft)] ${
                m.sender === "user"
                  ? "bg-primary text-primary-foreground rounded-tr-none"
                  : "bg-card text-foreground rounded-tl-none border border-border/40"
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}

        {/* Typing loading indicator */}
        {loading && (
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-primary">
              <Sparkles className="h-4 w-4 animate-spin" />
            </div>
            <div className="rounded-2xl rounded-tl-none border border-border/40 bg-card px-4 py-3 text-sm text-muted-foreground flex gap-1 items-center shadow-[var(--shadow-soft)]">
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
              <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggested prompts chips */}
      {messages.length === 1 && (
        <div className="mb-3 flex flex-wrap gap-2 animate-in fade-in duration-300">
          {[
            { text: "I have a mild headache", icon: HelpCircle },
            { text: "Suggest a diet for cold & fever", icon: HeartHandshake },
            { text: "Food options for diabetes", icon: Sparkles }
          ].map((prompt, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setInputText(prompt.text);
              }}
              className="flex items-center gap-1.5 rounded-full bg-card border border-border px-3.5 py-1.5 text-xs text-muted-foreground hover:bg-muted/30 transition cursor-pointer"
            >
              <prompt.icon className="h-3 w-3 text-primary" />
              <span>{prompt.text}</span>
            </button>
          ))}
        </div>
      )}

      {/* Input panel form */}
      <form
        onSubmit={handleSend}
        className="flex items-center gap-2 rounded-2xl bg-card border border-border p-1.5 shadow-[var(--shadow-soft)]"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask how you feel or get diet tips..."
          className="flex-1 bg-transparent px-3 py-2 text-sm outline-none text-foreground"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={!inputText.trim() || loading}
          className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[var(--shadow-soft)] hover:bg-primary/95 disabled:opacity-40 transition cursor-pointer"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </Screen>
  );
}
