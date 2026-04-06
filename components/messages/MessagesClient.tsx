"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Send, Paperclip, Trash2 } from "lucide-react";
import clsx from "clsx";
import { useAuthStore } from "@/store/useAuthStore";
import { useChatListener } from "@/hooks/useChatListener";

type Message = {
  id: string;
  from: "them" | "me";
  text: string;
  time: string;
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
};

type RealtimeEvent = Record<string, unknown>;

type SendChatResponse = {
  status: boolean;
  message: string | string[];
  data?: unknown;
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
  is_super_admin?: boolean | number;
  role?: string;
  user_role?: string;
  user_type?: string;
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
  isSuperAdmin?: boolean;
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
  process.env.NEXT_PUBLIC_API_URL || "https://backend.vintocash.com/api";

const FALLBACK_AVATAR = "/icons/aad.png";
const SUPER_ADMIN_ONLY_MESSAGE = "Only Super Admin chat is allowed.";
const SUPER_ADMIN_RECEIVER_ID = Number(
  process.env.NEXT_PUBLIC_SUPER_ADMIN_RECEIVER_ID || NaN
);
const SUPER_ADMIN_CHAT_ID = Number(
  process.env.NEXT_PUBLIC_SUPER_ADMIN_CHAT_ID || NaN
);
const SUPER_ADMIN_CONVERSATION_ID = String(
  process.env.NEXT_PUBLIC_SUPER_ADMIN_CONVERSATION_ID || ""
).trim();
const CHAT_POLL_INTERVAL_MS = 4000;
const MAX_CHAT_FILE_SIZE = 10 * 1024 * 1024;

const getDisplayTime = (latestTime: string) => {
  if (!latestTime) return "";
  const isoLike = latestTime.replace(" ", "T");
  const date = new Date(isoLike);
  if (Number.isNaN(date.getTime())) return latestTime;
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const toAbsoluteUrl = (rawUrl: string) => {
  if (!rawUrl) return "";
  if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) {
    return rawUrl;
  }

  const base = API_BASE_URL.replace(/\/api\/?$/, "").replace(/\/$/, "");
  const path = rawUrl.startsWith("/") ? rawUrl : `/${rawUrl}`;
  return `${base}${path}`;
};

const coerceRecord = (value: unknown): Record<string, unknown> => {
  if (typeof value === "object" && value !== null) {
    return value as Record<string, unknown>;
  }
  return {};
};

const readString = (
  record: Record<string, unknown>,
  keys: string[]
): string | undefined => {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) {
      return value;
    }
  }
  return undefined;
};

const readNumber = (
  record: Record<string, unknown>,
  keys: string[]
): number | undefined => {
  for (const key of keys) {
    const raw = record[key];
    const num = Number(raw);
    if (Number.isFinite(num)) {
      return num;
    }
  }
  return undefined;
};

const readFileLikeValue = (
  record: Record<string, unknown>,
  keys: string[]
): string | undefined => {
  for (const key of keys) {
    const value = record[key];
    if (!value) continue;

    if (typeof value === "string" && value.trim()) {
      return value;
    }

    if (Array.isArray(value)) {
      const first = value[0];
      if (typeof first === "string" && first.trim()) {
        return first;
      }
      if (typeof first === "object" && first !== null) {
        const firstRecord = first as Record<string, unknown>;
        const nested = readString(firstRecord, [
          "url",
          "path",
          "file",
          "image",
          "src",
          "location",
          "download_url",
        ]);
        if (nested) {
          return nested;
        }
      }
    }

    if (typeof value === "object" && value !== null) {
      const nestedRecord = value as Record<string, unknown>;
      const nested = readString(nestedRecord, [
        "url",
        "path",
        "file",
        "image",
        "src",
        "location",
        "download_url",
        "document",
        "document_url",
        "file_url",
      ]);
      if (nested) {
        return nested;
      }
    }
  }

  return undefined;
};

const parseRealtimeEvent = (
  event: RealtimeEvent,
  myUserId?: number
): {
  message: Message;
  conversationId?: string;
  chatId?: number;
} | null => {
  const eventRecord = coerceRecord(event);
  const dataRecord = coerceRecord(eventRecord.data);
  const eventPayloadRecord = coerceRecord(eventRecord.payload);
  const messageRecord = coerceRecord(eventRecord.message);
  const source =
    Object.keys(messageRecord).length > 0
      ? messageRecord
      : Object.keys(dataRecord).length > 0
        ? dataRecord
        : Object.keys(eventPayloadRecord).length > 0
          ? eventPayloadRecord
          : eventRecord;

  const fileUrlRaw =
    readFileLikeValue(source, [
      "chat_image",
      "chatimage",
      "image",
      "attachment",
      "file",
      "file_url",
      "image_url",
      "document_url",
      "document",
      "attachment_url",
      "media",
      "chat_file",
    ]) ||
    readFileLikeValue(eventRecord, [
      "chat_image",
      "chatimage",
      "image",
      "attachment",
      "file",
      "file_url",
      "image_url",
      "document_url",
      "document",
      "attachment_url",
      "media",
      "chat_file",
    ]);
  const fileName =
    readString(source, ["file_name", "attachment_name", "image_name"]) ||
    (fileUrlRaw ? fileUrlRaw.split("/").pop() : undefined);
  const fileType = readString(source, ["file_type", "mime_type", "content_type"]);
  const text = readString(source, ["message", "text", "body", "content"]) || "";

  if (!text && !fileUrlRaw) {
    return null;
  }

  const senderType = String(source.sender_type || "").toLowerCase();
  const senderId = readNumber(source, ["sender_id", "user_id", "from_id", "dealer_id"]);
  const isMe =
    source.is_me === true ||
    senderType === "me" ||
    senderType === "dealer" ||
    senderType === "self" ||
    (typeof myUserId === "number" && senderId === myUserId);

  const rawTime =
    readString(source, ["created_at", "updated_at", "time"]) ||
    new Date().toISOString();

  const id =
    readString(source, ["id", "message_id", "uuid"]) ||
    `rt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const message: Message = {
    id,
    from: isMe ? "me" : "them",
    text: text || "Sent an attachment",
    time: getDisplayTime(rawTime),
    fileUrl: fileUrlRaw ? toAbsoluteUrl(fileUrlRaw) : undefined,
    fileName,
    fileType,
  };

  const conversationId = readString(source, ["conversation_id", "conversationId"]);
  const chatId = readNumber(source, ["chat_id", "chatId"]);

  return { message, conversationId, chatId };
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
  const rawFile =
    readFileLikeValue(record, [
      "chat_image",
      "chatimage",
      "image",
      "attachment",
      "file",
      "file_url",
      "image_url",
      "document_url",
      "document",
      "attachment_url",
      "media",
      "chat_file",
    ]) || "";
  console.log("rawFile from API:", rawFile, "record:", record);
  const rawFileName =
    record.file_name ?? record.attachment_name ?? record.image_name ?? "";
  const rawFileType =
    record.file_type ?? record.mime_type ?? record.content_type ?? "";

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
    text: String(rawText || (rawFile ? "Sent an attachment" : "")),
    time: getDisplayTime(String(rawTime)),
    fileUrl: rawFile ? toAbsoluteUrl(String(rawFile)) : undefined,
    fileName: String(rawFileName || (rawFile ? String(rawFile).split("/").pop() : "")),
    fileType: String(rawFileType || ""),
  };
};

const isSuperAdminConversation = (item: ChatListItem): boolean => {
  const role = String(item.role || item.user_role || item.user_type || "").toLowerCase();
  const name = String(item.user_name || "").toLowerCase();
  const explicitFlag = item.is_super_admin === true || Number(item.is_super_admin) === 1;
  const byReceiverId =
    Number.isFinite(SUPER_ADMIN_RECEIVER_ID) && item.receiver_id === SUPER_ADMIN_RECEIVER_ID;
  const byChatId = Number.isFinite(SUPER_ADMIN_CHAT_ID) && item.chat_id === SUPER_ADMIN_CHAT_ID;
  const byConversationId =
    !!SUPER_ADMIN_CONVERSATION_ID && item.conversation_id === SUPER_ADMIN_CONVERSATION_ID;

  return (
    byReceiverId ||
    byChatId ||
    byConversationId ||
    explicitFlag ||
    role.includes("super_admin") ||
    role.includes("super admin") ||
    name.includes("super admin") ||
    name.includes("vintocash admin") ||
    name.includes("admin")
  );
};

const resolveConversationAvatar = (item: ChatListItem, isSuperAdmin: boolean) => {
  if (isSuperAdmin) {
    return item.chat_image || item.user_image || FALLBACK_AVATAR;
  }

  return item.chat_image || item.user_image || item.my_image || FALLBACK_AVATAR;
};

const buildConversationFromApi = (item: ChatListItem): Conversation => {
  const previewMessage = item.message || "No messages yet";
  const isSuperAdmin = isSuperAdminConversation(item);
  const image = resolveConversationAvatar(item, isSuperAdmin);

  return {
    id: item.conversation_id,
    chatId: item.chat_id,
    conversationId: item.conversation_id,
    receiverId: item.receiver_id,
    imageId: item.image_id || undefined,
    isSuperAdmin,
    name: item.user_name || "Unknown User",
    subtitle: previewMessage,
    avatar: image,
    time: getDisplayTime(item.latest_time),
    unread: item.unread_count > 0,
    messages: [],
  };
};

const buildMessagePreview = (text: string, fileName?: string) => {
  const trimmed = text.trim();
  if (fileName && (!trimmed || isAttachmentPlaceholderText(trimmed))) {
    return `Attachment: ${fileName}`;
  }

  if (isAttachmentPlaceholderText(trimmed)) {
    return "Attachment";
  }

  return trimmed || "No messages yet";
};

const isAttachmentPlaceholderText = (value: string) =>
  /^sent\s+an\s+attachment[.!]?$/i.test(value.trim());

const shouldHideMessageText = (message: Message) =>
  isAttachmentPlaceholderText(message.text);

const hasVisibleMessageText = (message: Message) =>
  !!message.text.trim() && !shouldHideMessageText(message);

const isImageOnlyMessage = (message: Message) =>
  !!message.fileUrl && isImageAttachment(message) && !hasVisibleMessageText(message);

const isLocalOptimisticMessage = (message: Message) =>
  message.id.startsWith("local-") && !!message.fileUrl;

const mergeMessagesById = (incoming: Message[], existing: Message[]) => {
  const merged = [...incoming];

  for (const message of existing) {
    if (!isLocalOptimisticMessage(message)) {
      continue;
    }

    const matchingServerMessage = merged.find(
      (item) =>
        item.from === message.from &&
        item.time === message.time &&
        item.fileName === message.fileName &&
        item.text === message.text
    );

    if (!matchingServerMessage || !matchingServerMessage.fileUrl) {
      merged.push(message);
    }
  }

  return merged;
};

const IMAGE_FILE_EXTENSIONS = new Set([
  "jpg",
  "jpeg",
  "png",
  "gif",
  "webp",
  "bmp",
  "svg",
  "heic",
  "heif",
  "avif",
]);

const getFileExtension = (value?: string) => {
  if (!value) return "";
  const clean = value.split("?")[0].split("#")[0];
  const parts = clean.split(".");
  if (parts.length < 2) return "";
  return parts[parts.length - 1].toLowerCase();
};

const isImageAttachment = (message: Message) => {
  const type = (message.fileType || "").toLowerCase();
  if (type.startsWith("image/")) {
    return true;
  }

  const extension =
    getFileExtension(message.fileName) || getFileExtension(message.fileUrl);
  return IMAGE_FILE_EXTENSIONS.has(extension);
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFilePreviewUrl, setSelectedFilePreviewUrl] = useState("");
  const [failedImageMessageIds, setFailedImageMessageIds] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!selectedFile || !selectedFile.type.startsWith("image/")) {
      setSelectedFilePreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setSelectedFilePreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedFile]);

  useChatListener<RealtimeEvent>({
    token: hydrated ? token : null,
    channelName: "chat-conversation",
    eventName: "ChatEvent",
    enabled: hydrated && !!token,
    isPrivate: true,
    onMessage: (event) => {
      const parsed = parseRealtimeEvent(event, authUser?.id);
      if (!parsed) {
        return;
      }

      setConversationState((prev) =>
        prev.map((conv) => {
          const matchByConversationId =
            !!parsed.conversationId &&
            (conv.id === parsed.conversationId ||
              conv.conversationId === parsed.conversationId);
          const matchByChatId =
            typeof parsed.chatId === "number" && conv.chatId === parsed.chatId;
          const isTargetConversation =
            matchByConversationId ||
            matchByChatId ||
            (!parsed.conversationId && typeof parsed.chatId !== "number" && conv.id === activeId);

          if (!isTargetConversation) {
            return conv;
          }

          const alreadyExists = conv.messages.some(
            (m) => m.id === parsed.message.id || (m.text === parsed.message.text && m.time === parsed.message.time)
          );

          if (alreadyExists) {
            return conv;
          }

          const isActiveConversation = conv.id === activeId;

          return {
            ...conv,
            messages: [...conv.messages, parsed.message],
            subtitle: buildMessagePreview(parsed.message.text, parsed.message.fileName),
            time: parsed.message.from === "me" ? "Now" : conv.time,
            unread: parsed.message.from === "me" ? false : !isActiveConversation,
          };
        })
      );
    },
  });

  const active = useMemo(() => {
    return conversationState.find((c) => c.id === activeId) || conversationState[0];
  }, [conversationState, activeId]);

  const fetchChatList = useCallback(
    async (showLoader: boolean) => {
      if (!hydrated) return;
      if (!token) {
        setListError("Please login to load chats.");
        return;
      }

      if (showLoader) {
        setIsLoadingList(true);
      }
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
        const superAdminConversations = mappedConversations.filter(
          (conv) => conv.isSuperAdmin
        );

        const fallbackAdminConversation = mappedConversations.find((conv) =>
          conv.name.toLowerCase().includes("admin")
        );

        const finalConversations =
          superAdminConversations.length > 0
            ? superAdminConversations
            : fallbackAdminConversation
              ? [{ ...fallbackAdminConversation, isSuperAdmin: true }]
              : [];

        setConversationState((prev) =>
          finalConversations.map((conv) => {
            const existing = prev.find((item) => item.id === conv.id);
            if (!existing) {
              return conv;
            }

            const latestExisting = existing.messages[existing.messages.length - 1];

            return {
              ...conv,
              messages: existing.messages,
              subtitle: latestExisting
                ? buildMessagePreview(latestExisting.text, latestExisting.fileName)
                : conv.subtitle,
            };
          })
        );

        if (finalConversations.length > 0) {
          setActiveId((prevActiveId) => {
            const stillExists = finalConversations.some((conv) => conv.id === prevActiveId);
            return stillExists ? prevActiveId : finalConversations[0].id;
          });
        } else {
          setActiveId("");
          setListError(SUPER_ADMIN_ONLY_MESSAGE);
        }
      } catch (error) {
        setListError(error instanceof Error ? error.message : "Failed to load chat list.");
      } finally {
        if (showLoader) {
          setIsLoadingList(false);
        }
      }
    },
    [hydrated, token]
  );

  const fetchConversationMessages = useCallback(
    async (conversationId: string, receiverId?: number, showLoader = false) => {
      if (!hydrated || !token || !conversationId) return;

      if (showLoader) {
        setIsLoadingMessages(true);
      }
      setMessagesError("");

      try {
        const response = await fetch(`${API_BASE_URL}/chat/get/${conversationId}`, {
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
            mapApiMessageToUi(item, idx, authUser?.id, receiverId)
          )
          : [];

        setConversationState((prev) =>
          prev.map((conv) =>
            conv.id === conversationId
              ? {
                ...conv,
                messages: mergeMessagesById(mappedMessages, conv.messages),
                subtitle: buildMessagePreview(
                  mergeMessagesById(mappedMessages, conv.messages)[
                    mergeMessagesById(mappedMessages, conv.messages).length - 1
                  ]?.text || conv.subtitle,
                  mergeMessagesById(mappedMessages, conv.messages)[
                    mergeMessagesById(mappedMessages, conv.messages).length - 1
                  ]?.fileName
                ),
              }
              : conv
          )
        );
      } catch (error) {
        if (showLoader) {
          setMessagesError(
            error instanceof Error
              ? error.message
              : "Failed to load conversation messages."
          );
        }
      } finally {
        if (showLoader) {
          setIsLoadingMessages(false);
        }
      }
    },
    [authUser?.id, hydrated, token]
  );

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
    void fetchChatList(true);
  }, [fetchChatList]);

  useEffect(() => {
    if (!hydrated || !token) return;

    const pollListId = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        void fetchChatList(false);
      }
    }, CHAT_POLL_INTERVAL_MS);

    return () => {
      window.clearInterval(pollListId);
    };
  }, [fetchChatList, hydrated, token]);

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
    const targetConversation = conversationState.find((conv) => conv.id === id);
    if (!targetConversation?.isSuperAdmin) {
      setSendError(SUPER_ADMIN_ONLY_MESSAGE);
      return;
    }

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

    void fetchConversationMessages(active.id, active.receiverId, true);

    const pollId = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        void fetchConversationMessages(active.id, active.receiverId, false);
      }
    }, CHAT_POLL_INTERVAL_MS);

    return () => {
      window.clearInterval(pollId);
    };
  }, [active?.id, active?.receiverId, fetchConversationMessages, hydrated, token]);

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
    if (result.data && typeof result.data === "object") {
      const dataRecord = result.data as Record<string, unknown>;
      const maybeErrors = dataRecord.errors;
      if (maybeErrors && typeof maybeErrors === "object") {
        const firstError = Object.values(maybeErrors as Record<string, unknown>)[0];
        if (Array.isArray(firstError) && firstError.length > 0) {
          return String(firstError[0]);
        }
      }
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

  const appendMyMessage = (text: string, file?: File) => {
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const newMessage: Message = {
      id: `local-${Date.now()}`,
      from: "me",
      text: text || (file ? "Sent an attachment" : ""),
      time,
      fileUrl: file ? URL.createObjectURL(file) : undefined,
      fileName: file?.name,
      fileType: file?.type,
    };

    setConversationState((prev) =>
      prev.map((conv) => {
        if (conv.id !== activeId) return conv;
        return {
          ...conv,
          subtitle: buildMessagePreview(newMessage.text, newMessage.fileName),
          time: "Now",
          messages: [...conv.messages, newMessage],
        };
      })
    );

    return newMessage;
  };

  const messageFromSendResult = (
    resultData: unknown,
    fallbackText: string,
    file?: File
  ): Message | null => {
    if (!resultData || typeof resultData !== "object") {
      return null;
    }

    const parsedMessage = mapApiMessageToUi(
      resultData,
      0,
      authUser?.id,
      active?.receiverId
    );
    const directRecord = coerceRecord(resultData);
    const directImageUrl =
      readFileLikeValue(directRecord, [
        "image_url",
        "file_url",
        "chat_image",
        "chatimage",
        "attachment",
        "file",
        "document_url",
      ]) ||
      readFileLikeValue(coerceRecord(directRecord.chatimage), [
        "image",
        "url",
        "path",
        "file_url",
      ]);
    const directFileName =
      readString(directRecord, ["file_name", "attachment_name", "image_name"]) ||
      readString(coerceRecord(directRecord.chatimage), ["image_name", "file_name"]) ||
      (directImageUrl ? directImageUrl.split("/").pop() : undefined);
    const directFileType = readString(directRecord, ["file_type", "mime_type", "content_type"]);

    return {
      ...parsedMessage,
      from: "me",
      text: parsedMessage.text || fallbackText || (file ? "Sent an attachment" : ""),
      fileUrl: parsedMessage.fileUrl || directImageUrl || (file ? URL.createObjectURL(file) : undefined),
      fileName:
        parsedMessage.fileName ||
        directFileName ||
        file?.name ||
        (parsedMessage.fileUrl ? parsedMessage.fileUrl.split("/").pop() : undefined),
      fileType: parsedMessage.fileType || directFileType || file?.type,
    };
  };

  const clearSelectedFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const markImagePreviewFailed = (messageId: string) => {
    setFailedImageMessageIds((prev) => {
      if (prev.includes(messageId)) {
        return prev;
      }
      return [...prev, messageId];
    });
  };

  const handleSendMessage = async () => {
    const message = input.trim();
    const messageForPayload = message || (selectedFile ? "Sent an attachment" : "");
    if ((!message && !selectedFile) || isSending) return;

    if (!active) {
      setSendError("No chat selected.");
      return;
    }

    if (!active.isSuperAdmin) {
      setSendError(SUPER_ADMIN_ONLY_MESSAGE);
      return;
    }

    if (!hydrated || !token) {
      setSendError("Please login to send messages.");
      return;
    }

    if (selectedFile && selectedFile.size > MAX_CHAT_FILE_SIZE) {
      setSendError("File size must be 10MB or less.");
      return;
    }

    setSendError("");
    setSendInfo("");
    setIsSending(true);

    try {
      const payload: Record<string, unknown> = {
        chat_id: active?.chatId || activeId,
        conversation_id: active?.conversationId || activeId,
        message: messageForPayload,
      };

      if (typeof active?.receiverId === "number") {
        payload.receiver_id = active.receiverId;
      }

      let response: Response;

      if (selectedFile) {
        const formData = new FormData();
        Object.entries(payload).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            formData.append(key, String(value));
          }
        });

        formData.append("chat_image", selectedFile);
        formData.append("image", selectedFile);
        formData.append("attachment", selectedFile);
        formData.append("file", selectedFile);

        response = await fetch(`${API_BASE_URL}/chat/send`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
      } else {
        response = await fetch(`${API_BASE_URL}/chat/send`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }

      const result: SendChatResponse = await response.json();

      if (!response.ok || !result.status) {
        const backendMessage = extractErrorMessage(result);

        if (isPusherBroadcastError(backendMessage)) {
          appendMyMessage(messageForPayload, selectedFile || undefined);
          setInput("");
          clearSelectedFile();
          setSendInfo("Message submitted, but real-time delivery is unavailable right now.");
          void fetchConversationMessages(active.id, active.receiverId, false);
          void fetchChatList(false);
          return;
        }

        throw new Error(backendMessage);
      }

      const serverMessage = messageFromSendResult(
        result.data,
        messageForPayload,
        selectedFile || undefined
      );

      if (serverMessage) {
        setConversationState((prev) =>
          prev.map((conv) => {
            if (conv.id !== activeId) return conv;
            const alreadyExists = conv.messages.some(
              (item) =>
                item.id === serverMessage.id ||
                (serverMessage.fileUrl && item.fileUrl === serverMessage.fileUrl)
            );

            if (alreadyExists) {
              return {
                ...conv,
                subtitle: buildMessagePreview(serverMessage.text, serverMessage.fileName),
                time: "Now",
              };
            }

            return {
              ...conv,
              subtitle: buildMessagePreview(serverMessage.text, serverMessage.fileName),
              time: "Now",
              messages: [...conv.messages, serverMessage],
            };
          })
        );
      } else {
        appendMyMessage(messageForPayload, selectedFile || undefined);
      }
      setInput("");
      clearSelectedFile();
      void fetchConversationMessages(active.id, active.receiverId, false);
      void fetchChatList(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to send message.";
      setSendError(errorMessage);
    } finally {
      setIsSending(false);
    }
  };

  const handleSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
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
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
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
              <path d="M19 12H5M12 5l-7 7 7 7" />
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
                    "max-w-[70%] text-sm leading-relaxed",
                    isImageOnlyMessage(msg)
                      ? "rounded-[28px] bg-[#FDECEC] p-2 shadow-sm"
                      : "px-4 py-3 rounded-2xl",
                    !isImageOnlyMessage(msg) &&
                    (msg.from === "me"
                      ? "bg-[#D93E39] text-white rounded-br-sm"
                      : "bg-red-50 text-gray-700 rounded-bl-sm")
                  )}
                >
                  {hasVisibleMessageText(msg) && <p>{msg.text}</p>}
                  {msg.fileUrl &&
                    isImageAttachment(msg) &&
                    !failedImageMessageIds.includes(msg.id) && (
                      <a
                        href={msg.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={clsx(
                          "block overflow-hidden",
                          isImageOnlyMessage(msg) ? "rounded-[22px]" : "mt-2 rounded-xl"
                        )}
                      >
                        <img
                          src={msg.fileUrl}
                          alt={msg.fileName || "Attachment image"}
                          className={clsx(
                            "w-full object-cover",
                            isImageOnlyMessage(msg)
                              ? "max-h-80 min-h-55 min-w-55"
                              : "max-h-64 max-w-70 rounded-xl"
                          )}
                          onError={() => markImagePreviewFailed(msg.id)}
                        />
                      </a>
                    )}
                  {msg.fileUrl &&
                    (!isImageAttachment(msg) || failedImageMessageIds.includes(msg.id)) && (
                      <a
                        href={msg.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className={clsx(
                          "mt-2 inline-flex items-center underline break-all",
                          msg.from === "me" ? "text-white" : "text-[#D93E39]"
                        )}
                      >
                        {msg.fileName || (isImageAttachment(msg) ? "View image" : "View attachment")}
                      </a>
                    )}
                  {!msg.fileUrl && msg.fileName && (
                    <p className="mt-2 break-all opacity-90">{msg.fileName}</p>
                  )}
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
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleSelectFile}
          />
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
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-gray-400 cursor-pointer hover:text-gray-600 transition-colors p-1"
            >
              <Paperclip size={16} />
            </button>
            <button
              onClick={handleSendMessage}
              disabled={isSending || (!input.trim() && !selectedFile)}
              className="w-8 h-8 bg-[#D93E39] cursor-pointer rounded-xl flex items-center justify-center transition-colors shrink-0 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Send size={14} className="text-white" />
            </button>
          </div>
          {selectedFile && (
            <div className="mt-2 flex items-center justify-between rounded-lg border border-[#D93E39]/30 bg-white px-3 py-2 text-xs text-gray-700">
              <div className="min-w-0 flex-1">
                {selectedFile.type.startsWith("image/") && selectedFilePreviewUrl && (
                  <img
                    src={selectedFilePreviewUrl}
                    alt={selectedFile.name}
                    className="mb-2 h-20 w-20 rounded-lg object-cover"
                  />
                )}
                <span className="truncate block">Attachment: {selectedFile.name}</span>
              </div>
              <button
                type="button"
                onClick={clearSelectedFile}
                className="ml-3 text-[#D93E39] cursor-pointer"
              >
                Remove
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}