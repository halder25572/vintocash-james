"use client";

import { getEcho } from "@/lib/echo";
import { useEffect, useRef } from "react";

type ListenerOptions<TPayload> = {
  token: string | null;
  channelName?: string;
  eventName?: string;
  enabled?: boolean;
  isPrivate?: boolean;
  listenPublicFallback?: boolean;
  onMessage: (payload: TPayload) => void;
};

type EchoChannel = {
  listen: (eventName: string, callback: (event: unknown) => void) => EchoChannel;
  stopListening?: (eventName: string) => void;
};

type EchoInstance = {
  private: (channelName: string) => EchoChannel;
  channel: (channelName: string) => EchoChannel;
  leave: (channelName: string) => void;
};

export function useChatListener<TPayload = unknown>({
  token,
  channelName = "chat-conversation",
  eventName = "ChatEvent",
  enabled = true,
  isPrivate = true,
  listenPublicFallback = true,
  onMessage,
}: ListenerOptions<TPayload>) {
  const onMessageRef = useRef(onMessage);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    if (!enabled || !token) {
      return;
    }

    let mounted = true;
    let privateChannel: EchoChannel | null = null;
    let publicChannel: EchoChannel | null = null;
    let echo: EchoInstance | null = null;

    const handleEvent = (payload: unknown) => {
      onMessageRef.current(payload as TPayload);
    };

    (async () => {
      const instance = (await getEcho(token)) as EchoInstance | null;
      if (!instance || !mounted) {
        return;
      }

      echo = instance;
      if (isPrivate) {
        privateChannel = instance.private(channelName);
        privateChannel.listen(eventName, handleEvent);
        privateChannel.listen(`.${eventName}`, handleEvent);
      }

      if (!isPrivate || listenPublicFallback) {
        publicChannel = instance.channel(channelName);
        publicChannel.listen(eventName, handleEvent);
        publicChannel.listen(`.${eventName}`, handleEvent);
      }
    })();

    return () => {
      mounted = false;
      try {
        privateChannel?.stopListening?.(eventName);
        privateChannel?.stopListening?.(`.${eventName}`);
        publicChannel?.stopListening?.(eventName);
        publicChannel?.stopListening?.(`.${eventName}`);
        echo?.leave(channelName);
        echo?.leave(`private-${channelName}`);
        echo?.leave(`presence-${channelName}`);
      } catch {
        // ignore cleanup errors
      }
    };
  }, [channelName, enabled, eventName, isPrivate, token]);
}
