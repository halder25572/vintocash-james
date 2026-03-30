"use client";

import { useState } from "react";
import Image from "next/image";
import { Send, Paperclip } from "lucide-react";
import clsx from "clsx";

type Message = {
  id: string;
  from: "them" | "me";
  text: string;
  time: string;
};

type Conversation = {
  id: string;
  name: string;
  subtitle: string;
  avatar: string;
  time: string;
  unread?: boolean;
  messages: Message[];
};

const conversations: Conversation[] = [
  {
    id: "1",
    name: "VintoCash Admin",
    subtitle: "Your bid has been approved for t...",
    avatar: "/icons/aad.png",
    time: "",
    unread: true,
    messages: [
      {
        id: "m1",
        from: "them",
        text: "Hello John! I wanted to update you on your recent bid for the 2022 Tesla Model 3.",
        time: "Yesterday 2:30 PM",
      },
      {
        id: "m2",
        from: "me",
        text: "reat! I'm very interested in this vehicle. What's the status",
        time: "Yesterday 4:15 PM",
      },
      {
        id: "m3",
        from: "them",
        text: "Absolutely! We can schedule an inspection at our Los Angeles facility anytime this week. What works best for you?",
        time: "2 hours ago",
      },
      {
        id: "m4",
        from: "me",
        text: "Perfect! I'll keep an eye out for it. Is the vehicle available for inspection?",
        time: "Yesterday 4:15 PM",
      },
    ],
  },
  {
    id: "2",
    name: "Support Team",
    subtitle: "We have received your inquiry a...",
    avatar: "/icons/ccaa.png",
    time: "Yesterday",
    messages: [
      {
        id: "s1",
        from: "them",
        text: "We have received your inquiry and will get back to you shortly.",
        time: "Yesterday 10:00 AM",
      },
    ],
  },
  {
    id: "3",
    name: "VintoCash",
    subtitle: "The 2021 Porsche 911 is now availa...",
    avatar: "/icons/aad.png",
    time: "Mar 12",
    messages: [
      {
        id: "v1",
        from: "them",
        text: "The 2021 Porsche 911 is now available for bidding. Don't miss out!",
        time: "Mar 12 9:00 AM",
      },
    ],
  },
];

export default function MessagesClient() {
  const [activeId, setActiveId] = useState("1");
  const [input, setInput] = useState("");
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");

  const active = conversations.find((c) => c.id === activeId)!;

  const handleSelect = (id: string) => {
    setActiveId(id);
    setMobileView("chat");
  };

  return (
    <div className="flex h-[calc(100vh-100px)] gap-4 mt-8">
      {/* LEFT — Conversation List */}
      <div
        className={clsx(
          "w-full lg:w-64 shrink-0 bg-white rounded-2xl border border-[#D93E39] overflow-hidden flex flex-col",
          mobileView === "chat" ? "hidden lg:flex" : "flex"
        )}
      >
        {/* Search */}
        <div className="p-3 border-b border-gray-100">
          <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-sm text-gray-500 placeholder-gray-400 outline-none w-full"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => handleSelect(conv.id)}
              className={clsx(
                "w-full flex cursor-pointer items-start gap-3 px-4 py-3.5 transition-colors text-left border-b border-gray-50",
                activeId === conv.id
                  ? "bg-red-50 border-l-2 border-l-[#D93E39]"
                  : "hover:bg-gray-50"
              )}
            >
              {/* Avatar */}
              <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0">
                <Image
                  src={conv.avatar}
                  alt={conv.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {conv.name}
                  </p>
                  <span className="text-[10px] text-gray-400 shrink-0 ml-1">
                    {conv.time}
                  </span>
                </div>
                <p className="text-xs text-gray-400 truncate mt-0.5">
                  {conv.subtitle}
                </p>
              </div>
              {conv.unread && (
                <span className="w-2 h-2 bg-[#D93E39] rounded-full shrink-0 mt-1.5" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT — Chat Area */}
      <div
        className={clsx(
          "flex-1 bg-white rounded-2xl border border-[#D93E39] overflow-hidden flex flex-col",
          mobileView === "list" ? "hidden lg:flex" : "flex"
        )}
      >
        {/* Chat Header */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
          {/* Back button — mobile */}
          <button
            className="lg:hidden mr-1 cursor-pointer text-gray-400 hover:text-gray-600"
            onClick={() => setMobileView("list")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
          </button>

          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-100 shrink-0">
            <Image
              src={active.avatar}
              alt={active.name}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">{active.name}</p>
            <p className="text-xs text-gray-400">{active.subtitle.replace("...", "")}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {active.messages.map((msg) => (
            <div key={msg.id}>
              <div
                className={clsx(
                  "flex",
                  msg.from === "me" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={clsx(
                    "max-w-[70%] px-4 py-3 rounded-2xl text-sm leading-relaxed",
                    msg.from === "me"
                      ? "bg-[#D93E39] text-white rounded-br-sm"
                      : "bg-red-50 text-gray-700 rounded-bl-sm"
                  )}
                >
                  {msg.text}
                </div>
              </div>
              <p
                className={clsx(
                  "text-[10px] text-gray-400 mt-1",
                  msg.from === "me" ? "text-right" : "text-left"
                )}
              >
                {msg.time}
              </p>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="px-4 py-4 border-t border-[#D93E39] bg-[#FDECEC]">
          <div className="flex items-center gap-2 border border-[#D93E39] rounded-2xl px-4 py-2.5 bg-[#FDECEC]">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && setInput("")}
              placeholder="Type your message..."
              className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
            />
            <button className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors p-1">
              <Paperclip size={16} />
            </button>
            <button
              onClick={() => setInput("")}
              className="w-8 h-8 bg-[#D93E39] cursor-pointer rounded-xl flex items-center justify-center transition-colors shrink-0"
            >
              <Send size={14} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}