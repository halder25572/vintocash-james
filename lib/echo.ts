"use client";

declare global {
  interface Window {
    Echo: unknown;
    Pusher: unknown;
  }
}

type EchoInstance = {
  private: (channelName: string) => unknown;
  channel: (channelName: string) => unknown;
  leave: (channelName: string) => void;
};

type ReverbConfig = {
  key: string;
  host: string;
  port: number;
  forceTLS: boolean;
  authEndpoint: string;
};

let echo: EchoInstance | null = null;
let echoToken: string | null = null;

const getEnv = (primary: string, secondary?: string) => {
  const first = process.env[primary];
  if (first && first.trim()) {
    return first.trim();
  }

  if (secondary) {
    const second = process.env[secondary];
    if (second && second.trim()) {
      return second.trim();
    }
  }

  return "";
};

const parsePort = (value: string, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const resolveAuthEndpoint = () => {
  const direct = getEnv("NEXT_PUBLIC_REVERB_AUTH_ENDPOINT", "VITE_REVERB_AUTH_ENDPOINT");
  if (direct) {
    return direct;
  }

  const socketEndpoint = getEnv("NEXT_PUBLIC_SOCKET_ENDPOINT", "VITE_SOCKET_ENDPOINT");
  if (socketEndpoint) {
    if (socketEndpoint.startsWith("http://") || socketEndpoint.startsWith("https://")) {
      return socketEndpoint.includes("/broadcasting/auth")
        ? socketEndpoint
        : `${socketEndpoint.replace(/\/$/, "")}/broadcasting/auth`;
    }
    return `https://${socketEndpoint.replace(/\/$/, "")}/broadcasting/auth`;
  }

  const host = getEnv("NEXT_PUBLIC_REVERB_HOST", "VITE_REVERB_HOST");
  if (host) {
    return `https://${host.replace(/\/$/, "")}/broadcasting/auth`;
  }

  const apiBase = getEnv("NEXT_PUBLIC_API_URL");
  if (apiBase) {
    return `${apiBase.replace(/\/$/, "")}/broadcasting/auth`;
  }

  return "";
};

const resolveConfig = (): ReverbConfig => {
  const key = getEnv("NEXT_PUBLIC_REVERB_APP_KEY", "VITE_REVERB_APP_KEY");
  const host = getEnv("NEXT_PUBLIC_REVERB_HOST", "VITE_REVERB_HOST");
  const scheme = getEnv("NEXT_PUBLIC_REVERB_SCHEME", "VITE_REVERB_SCHEME").toLowerCase();
  const configuredPort = getEnv("NEXT_PUBLIC_REVERB_PORT", "VITE_REVERB_PORT");
  const port = parsePort(configuredPort, 443);
  const forceTLS = scheme === "https" || scheme === "wss" || port === 443;
  const authEndpoint = resolveAuthEndpoint();

  return {
    key,
    host,
    port,
    forceTLS,
    authEndpoint,
  };
};

export async function getEcho(token?: string | null) {
  if (!token || typeof window === "undefined") {
    return null;
  }

  if (echo && echoToken === token) {
    return echo;
  }

  if (echo && echoToken !== token) {
    try {
      (echo as EchoInstance & { disconnect?: () => void }).disconnect?.();
    } catch {
      // ignore disconnect failures during token refresh
    }
    echo = null;
  }

  const config = resolveConfig();

  if (!config.key || !config.host || !config.authEndpoint) {
    return null;
  }

  const [{ default: Echo }, { default: Pusher }] = await Promise.all([
    import("laravel-echo"),
    import("pusher-js"),
  ]);

  window.Pusher = Pusher;

  const instance = new Echo({
    broadcaster: "reverb",
    key: config.key,
    wsHost: config.host,
    wsPort: config.forceTLS ? undefined : config.port,
    wssPort: config.forceTLS ? config.port : undefined,
    forceTLS: config.forceTLS,
    enabledTransports: ["ws", "wss"],
    authEndpoint: config.authEndpoint,
    auth: {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  });

  echo = instance as EchoInstance;
  echoToken = token;
  window.Echo = echo;

  return echo;
}

export function resetEcho() {
  echo = null;
  echoToken = null;
}
