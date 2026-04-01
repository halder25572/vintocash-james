"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Send, Paperclip, Trash2 } from "lucide-react";
import clsx from "clsx";
import { useAuthStore } from "@/store/useAuthStore";

type Message = {
  id: string;
  from: "them" | "me";
  text: string;
  time: string;
};

type SendChatResponse = {
  status: boolean;
  message: string | string[];
  data?: string;
  code?: number;
};

type DeleteChatResponse = {
  status: boolean;
  message: string | string[];
  data?: string;
  code?: number;
};

type DeleteChatImageResponse = {
  status: boolean;
  message: string | string[];
  data?: string;
  code?: number;
};

type MarkReadResponse = {
  status: boolean;
  message: string | string[];
  data?: unknown[];
};

type ChatListItem = {
  chat_id: number;
  conversation_id: string;
  latest_time: string;
  message: string;
  user_name: string;
  receiver_id: number;
  user_image: string;
  my_image: string;
  chat_image: string;
  image_id: string;
  unread_count: number;
};

type ChatListResponse = {
  status: boolean;
  message: string | string[];
  data: ChatListItem[];
};

type GetConversationResponse = {
  status: boolean;
  message: string | string[];
  data: unknown[];
};

type Conversation = {
  id: string;
  chatId?: number;
  conversationId?: string;
  receiverId?: number;
  imageId?: string;
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

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL_DEAL || "https://secondbackend.vintocash.com/api";

const FALLBACK_AVATAR = "/icons/aad.png";

const getDisplayTime = (latestTime: string) => {
  if (!latestTime) return "";
  const isoLike = latestTime.replace(" ", "T");
  const date = new Date(isoLike);
  if (Number.isNaN(date.getTime())) return latestTime;
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const mapApiMessageToUi = (
  item: unknown,
  idx: number,
  myUserId?: number,
  otherPartyId?: number
): Message => {
  const record = (item || {}) as Record<string, unknown>;

  const rawId =
    record.id ??
    record.message_id ??
    record.chat_id ??
    `${Date.now()}-${idx}`;

  const rawText = record.message ?? record.text ?? record.body ?? "";

  const senderType = String(record.sender_type || "").toLowerCase();
  const numericSenderId = Number(
    record.sender_id ?? record.user_id ?? record.from_id ?? record.dealer_id ?? NaN
  );

  const senderIsMeById =
    Number.isFinite(numericSenderId) &&
    typeof myUserId === "number" &&
    numericSenderId === myUserId;

  const senderIsThemByOtherParty =
    Number.isFinite(numericSenderId) &&
    typeof otherPartyId === "number" &&
    numericSenderId === otherPartyId;

  const isMe =
    record.is_me === true ||
    senderType === "me" ||
    senderType === "dealer" ||
    senderType === "self" ||
    senderIsMeById ||
    !senderIsThemByOtherParty;

  const rawTime = record.created_at ?? record.updated_at ?? record.time ?? "";

  return {
    id: String(rawId),
    from: isMe ? "me" : "them",
    text: String(rawText),
    time: getDisplayTime(String(rawTime)),
  };
};

const buildConversationFromApi = (item: ChatListItem): Conversation => {
  const previewMessage = item.message || "No messages yet";
  const image = item.chat_image || item.user_image || item.my_image || FALLBACK_AVATAR;

  return {
    id: item.conversation_id,
    chatId: item.chat_id,
    conversationId: item.conversation_id,
    receiverId: item.receiver_id,
    imageId: item.image_id || undefined,
    name: item.user_name || "Unknown User",
    subtitle: previewMessage,
    avatar: image,
    time: getDisplayTime(item.latest_time),
    unread: item.unread_count > 0,
    messages: [],
  };
};

export default function MessagesClient() {
  const token = useAuthStore((state) => state.token);
  const authUser = useAuthStore((state) => state.user);
  const [hydrated, setHydrated] = useState(false);
  const [activeId, setActiveId] = useState("1");
  const [conversationState, setConversationState] = useState(conversations);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [listError, setListError] = useState("");
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [sendInfo, setSendInfo] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [isDeletingImage, setIsDeletingImage] = useState(false);
  const [imageDeleteError, setImageDeleteError] = useState("");
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [messagesError, setMessagesError] = useState("");
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");

  const active = useMemo(() => {
    return conversationState.find((c) => c.id === activeId) || conversationState[0];
  }, [conversationState, activeId]);

  useEffect(() => {
    const unsub = useAuthStore.persist.onFinishHydration(() => {
      setHydrated(true);
    });
    if (useAuthStore.persist.hasHydrated()) {
      setHydrated(true);
    }
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!token) {
      setListError("Please login to load chats.");
      return;
    }

    const fetchChatList = async () => {
      setIsLoadingList(true);
      setListError("");

      try {
        const response = await fetch(`${API_BASE_URL}/chat/list/data`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const result: ChatListResponse = await response.json();
        if (!response.ok || !result.status) {
          throw new Error("Failed to load chat list.");
        }

        const mappedConversations = (result.data || []).map(buildConversationFromApi);
        setConversationState(mappedConversations);

        if (mappedConversations.length > 0) {
          setActiveId(mappedConversations[0].id);
        }
      } catch (error) {
        setListError(error instanceof Error ? error.message : "Failed to load chat list.");
      } finally {
        setIsLoadingList(false);
      }
    };

    void fetchChatList();
  }, [hydrated, token]);

  const markConversationAsRead = async (conversationId: string) => {
    const target = conversationState.find((conv) => conv.id === conversationId);
    if (!target?.unread) return;
    if (!hydrated || !token) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/chat/mark/read/${conversationId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result: MarkReadResponse = await response.json();
      if (!response.ok || !result.status) {
        return;
      }

      setConversationState((prev) =>
        prev.map((conv) =>
          conv.id === conversationId ? { ...conv, unread: false } : conv
        )
      );
    } catch {
      // Keep UI unchanged if read status update fails.
    }
  };

  const handleSelect = (id: string) => {
    setActiveId(id);
    setSendError("");
    setSendInfo("");
    setDeleteError("");
    setImageDeleteError("");
    setMobileView("chat");
    void markConversationAsRead(id);
  };

  useEffect(() => {
    if (!active?.id) return;
    if (!active.unread) return;
    void markConversationAsRead(active.id);
  }, [active?.id, active?.unread, hydrated, token]);

  useEffect(() => {
    if (!hydrated) return;
    if (!token) return;
    if (!active?.id) return;

    const fetchConversationMessages = async () => {
      setIsLoadingMessages(true);
      setMessagesError("");

      try {
        const response = await fetch(`${API_BASE_URL}/chat/get/${active.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const result: GetConversationResponse = await response.json();
        if (!response.ok || !result.status) {
          throw new Error("Failed to load conversation messages.");
        }

        const mappedMessages = Array.isArray(result.data)
          ? result.data.map((item, idx) =>
              mapApiMessageToUi(item, idx, authUser?.id, active?.receiverId)
            )
          : [];

        setConversationState((prev) =>
          prev.map((conv) =>
            conv.id === active.id
              ? {
                  ...conv,
                  messages: mappedMessages,
                  subtitle:
                    mappedMessages[mappedMessages.length - 1]?.text || conv.subtitle,
                }
              : conv
          )
        );
      } catch (error) {
        setMessagesError(
          error instanceof Error
            ? error.message
            : "Failed to load conversation messages."
        );
      } finally {
        setIsLoadingMessages(false);
      }
    };

    void fetchConversationMessages();
  }, [active?.id, active?.receiverId, authUser?.id, hydrated, token]);

  const extractErrorMessage = (result: SendChatResponse) => {
    if (Array.isArray(result.message) && result.message.length > 0) {
      return result.message.join(", ");
    }
    if (typeof result.message === "string" && result.message.trim()) {
      return result.message;
    }
    if (typeof result.data === "string" && result.data.trim()) {
      return result.data;
    }
    return "Failed to send message. Please try again.";
  };

  const isPusherBroadcastError = (message: string) => {
    const normalized = message.toLowerCase();
    return (
      normalized.includes("pusher error") ||
      (normalized.includes("localhost") && normalized.includes("8080")) ||
      normalized.includes("could not connect to server")
    );
  };

  const extractDeleteErrorMessage = (result: DeleteChatResponse) => {
    if (Array.isArray(result.message) && result.message.length > 0) {
      return result.message.join(", ");
    }
    if (typeof result.message === "string" && result.message.trim()) {
      return result.message;
    }
    if (typeof result.data === "string" && result.data.trim()) {
      return result.data;
    }
    return "Failed to delete chat. Please try again.";
  };

  const extractImageDeleteErrorMessage = (result: DeleteChatImageResponse) => {
    if (Array.isArray(result.message) && result.message.length > 0) {
      return result.message.join(", ");
    }
    if (typeof result.message === "string" && result.message.trim()) {
      return result.message;
    }
    if (typeof result.data === "string" && result.data.trim()) {
      return result.data;
    }
    return "Failed to delete chat image. Please try again.";
  };

  const appendMyMessage = (text: string) => {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newMessage: Message = {
      id: `local-${Date.now()}`,
      from: "me",
      text,
      time,
    };

    setConversationState((prev) =>
      prev.map((conv) => {
        if (conv.id !== activeId) return conv;
        return {
          ...conv,
          subtitle: text,
          time: "Now",
          messages: [...conv.messages, newMessage],
        };
      })
    );

    return newMessage;
  };

  const handleSendMessage = async () => {
    const message = input.trim();
    if (!message || isSending) return;

    if (!active) {
      setSendError("No chat selected.");
      return;
    }

    if (!hydrated || !token) {
      setSendError("Please login to send messages.");
      return;
    }

    setSendError("");
    setSendInfo("");
    setIsSending(true);

    try {
      const payload: Record<string, unknown> = {
        chat_id: active?.chatId || activeId,
        conversation_id: active?.conversationId || activeId,
        message,
      };

      if (typeof active?.receiverId === "number") {
        payload.receiver_id = active.receiverId;
      }

      const response = await fetch(`${API_BASE_URL}/chat/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result: SendChatResponse = await response.json();

      if (!response.ok || !result.status) {
        const backendMessage = extractErrorMessage(result);

        if (isPusherBroadcastError(backendMessage)) {
          appendMyMessage(message);
          setInput("");
          setSendInfo("Message submitted, but real-time delivery is unavailable right now.");
          return;
        }

        throw new Error(backendMessage);
      }

      appendMyMessage(message);
      setInput("");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to send message.";
      setSendError(errorMessage);
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteChat = async () => {
    if (isDeleting) return;

    if (!active?.chatId) {
      setDeleteError("Chat id not found for this conversation.");
      return;
    }

    if (!hydrated || !token) {
      setDeleteError("Please login to delete chats.");
      return;
    }

    setDeleteError("");
    setIsDeleting(true);

    try {
      let response = await fetch(`${API_BASE_URL}/chat/delete/${active.chatId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // Some backends expose this as GET-only route.
      if (response.status === 405) {
        response = await fetch(`${API_BASE_URL}/chat/delete/${active.chatId}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      }

      const result: DeleteChatResponse = await response.json();

      if (!response.ok || !result.status) {
        throw new Error(extractDeleteErrorMessage(result));
      }

      const remaining = conversationState.filter((conv) => conv.id !== active.id);
      setConversationState(remaining);
      setActiveId(remaining[0]?.id || "");
      setInput("");
      setSendError("");
      setMobileView(remaining.length > 0 ? "chat" : "list");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete chat.";
      setDeleteError(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteChatImage = async () => {
    if (isDeletingImage) return;

    if (!active?.imageId) {
      setImageDeleteError("Image id not found for this chat.");
      return;
    }

    if (!hydrated || !token) {
      setImageDeleteError("Please login to delete chat image.");
      return;
    }

    setImageDeleteError("");
    setIsDeletingImage(true);

    try {
      let response = await fetch(
        `${API_BASE_URL}/chat/image/delete/${active.imageId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Some backends expose this as GET-only route.
      if (response.status === 405) {
        response = await fetch(
          `${API_BASE_URL}/chat/image/delete/${active.imageId}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      const result: DeleteChatImageResponse = await response.json();

      if (!response.ok || !result.status) {
        throw new Error(extractImageDeleteErrorMessage(result));
      }

      setConversationState((prev) =>
        prev.map((conv) =>
          conv.id === active.id
            ? { ...conv, imageId: undefined, avatar: FALLBACK_AVATAR }
            : conv
        )
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete chat image.";
      setImageDeleteError(errorMessage);
    } finally {
      setIsDeletingImage(false);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
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
          {isLoadingList && (
            <div className="px-4 py-3 text-xs text-gray-500">Loading chats...</div>
          )}

          {!!listError && (
            <div className="px-4 py-3 text-xs text-red-600">{listError}</div>
          )}

          {!isLoadingList && !listError && conversationState.length === 0 && (
            <div className="px-4 py-3 text-xs text-gray-500">No chats found.</div>
          )}

          {conversationState.map((conv) => (
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
              src={active?.avatar || FALLBACK_AVATAR}
              alt={active?.name || "Chat User"}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800">{active?.name || "No chat selected"}</p>
            <p className="text-xs text-gray-400">{(active?.subtitle || "").replace("...", "")}</p>
          </div>

          <button
            type="button"
            onClick={handleDeleteChatImage}
            disabled={isDeletingImage || !active?.imageId}
            className="ml-auto inline-flex items-center gap-1 rounded-lg border border-amber-200 px-2.5 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-50 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isDeletingImage ? "Removing Image..." : "Remove Image"}
          </button>

          <button
            type="button"
            onClick={handleDeleteChat}
            disabled={isDeleting || !active?.chatId}
            className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <Trash2 size={14} />
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {!!imageDeleteError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {imageDeleteError}
            </div>
          )}

          {!!messagesError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {messagesError}
            </div>
          )}

          {!!deleteError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {deleteError}
            </div>
          )}

          {!!sendError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
              {sendError}
            </div>
          )}

          {!!sendInfo && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
              {sendInfo}
            </div>
          )}

          {isLoadingMessages && (
            <div className="text-xs text-gray-500">Loading messages...</div>
          )}

          {!isLoadingMessages && (active?.messages || []).length === 0 && !messagesError && (
            <div className="text-xs text-gray-500">No messages in this conversation yet.</div>
          )}

          {(active?.messages || []).map((msg) => (
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
              onKeyDown={handleInputKeyDown}
              placeholder="Type your message..."
              disabled={isSending}
              className="flex-1 text-sm text-gray-700 placeholder-gray-400 outline-none bg-transparent"
            />
            <button className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors p-1">
              <Paperclip size={16} />
            </button>
            <button
              onClick={handleSendMessage}
              disabled={isSending || !input.trim()}
              className="w-8 h-8 bg-[#D93E39] cursor-pointer rounded-xl flex items-center justify-center transition-colors shrink-0 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Send size={14} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}