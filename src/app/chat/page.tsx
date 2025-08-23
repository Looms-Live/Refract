
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
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-blue-900 flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl bg-gray-900 rounded-xl shadow-lg p-6 flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-blue-400 mb-2 text-center">RefractAI Chat</h1>
        <div className="flex flex-col gap-2 overflow-y-auto h-96 bg-gray-800 rounded-md p-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`px-4 py-2 rounded-lg max-w-[80%] text-sm ${msg.role === "user" ? "bg-blue-600 text-white" : msg.role === "assistant" ? "bg-gray-700 text-blue-200" : "bg-gray-700 text-gray-400 italic"}`}>
                {msg.content}
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSend} className="flex gap-2 mt-2">
          <input
            type="text"
            className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your question..."
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={loading}
            autoFocus
          />
          <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition"
            disabled={loading || !input.trim()}
          >
            {loading ? "..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}
