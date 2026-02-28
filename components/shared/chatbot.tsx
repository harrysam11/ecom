"use client"

import { useState } from "react"
import { MessageCircle, X, Send, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Chatbot({ storeName }: { storeName: string }) {
    const [isOpen, setIsOpen] = useState(false)
    const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([
        { role: 'bot', text: `Hi there! Welcome to ${storeName}. How can I help you today?` }
    ])
    const [input, setInput] = useState("")

    const handleSend = () => {
        if (!input.trim()) return

        // Add user message
        const newMessages = [...messages, { role: 'user' as const, text: input }]
        setMessages(newMessages)
        setInput("")

        // Simulate AI response
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                { role: 'bot', text: "Thanks for your message! Our AI is currently in beta. A human team member will get back to you shortly." }
            ])
        }, 1000)
    }

    return (
        <>
            {/* Chat Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 w-14 h-14 bg-black text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-transform z-50"
                >
                    <MessageCircle className="w-6 h-6" />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-[350px] h-[500px] bg-white border border-black/10 shadow-2xl rounded-2xl flex flex-col z-50 overflow-hidden font-sans">
                    <div className="bg-black text-white p-4 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Bot className="w-5 h-5" />
                            <span className="font-bold text-sm tracking-widest uppercase">{storeName} AI Support</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:opacity-70">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-secondary/10">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-black text-white rounded-tr-none' : 'bg-white border shadow-sm rounded-tl-none text-black'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 bg-white border-t border-black/5 flex items-center gap-2">
                        <input
                            type="text"
                            placeholder="Type a message..."
                            className="flex-1 h-10 px-3 text-sm focus:outline-none border border-black/10 rounded-lg focus:border-black"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <Button size="icon" className="h-10 w-10 shrink-0" onClick={handleSend}>
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}
        </>
    )
}
