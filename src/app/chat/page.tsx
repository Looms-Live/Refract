

"use client";
import React, { useState } from "react";

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: "system", content: "Welcome to RefractAI Chat! Ask anything about your company data." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    // Simulate response (replace with actual API call)
    setTimeout(() => {
      setMessages([...newMessages, { role: "assistant", content: "This is a sample response. (Connect backend here)" }]);
      setLoading(false);
    }, 1200);
  };

  return (
  <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-0 relative">
      {/* Grid Background */}
      <div className="fixed inset-0 w-full h-full opacity-30 grid-background z-0"></div>
  <div className="w-full h-screen max-w-4xl bg-white flex flex-col justify-between relative z-10 px-4">
        <div className="flex flex-col gap-2 overflow-y-auto flex-1 bg-gray-100 p-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`px-4 py-2 rounded-lg max-w-[80%] text-base ${msg.role === "user" ? "bg-black text-white" : msg.role === "assistant" ? "bg-gray-200 text-black" : "bg-gray-100 text-gray-400 italic"}`}>
                {msg.content}
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSend} className="flex gap-2 p-6 bg-white">
          <input
            type="text"
            className="flex-1 px-4 py-3 rounded-lg bg-gray-100 text-black border-none focus:outline-none focus:ring-2 focus:ring-black text-base"
            placeholder="Type your question..."
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={loading}
            autoFocus
          />
          <button
            type="submit"
            className="px-8 py-3 rounded-lg bg-black text-white font-semibold hover:bg-gray-900 transition text-base"
            disabled={loading || !input.trim()}
          >
            {loading ? "..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}
