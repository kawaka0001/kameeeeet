import type { ServerEnv, ClientEnv } from "@/types";

/**
 * Validates server environment variables
 * @throws Error if required variables are missing
 */
export function validateServerEnv(): ServerEnv {
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;

  if (!apiKey) {
    throw new Error("LIVEKIT_API_KEY is not defined");
  }

  if (!apiSecret) {
    throw new Error("LIVEKIT_API_SECRET is not defined");
  }

  return {
    LIVEKIT_API_KEY: apiKey,
    LIVEKIT_API_SECRET: apiSecret,
  };
}

/**
 * Validates client environment variables
 * @throws Error if required variables are missing
 */
export function validateClientEnv(): ClientEnv {
  const livekitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

  if (!livekitUrl) {
    throw new Error("NEXT_PUBLIC_LIVEKIT_URL is not defined");
  }

  return {
    NEXT_PUBLIC_LIVEKIT_URL: livekitUrl,
  };
}

/**
 * Gets validated server environment variables
 */
export function getServerEnv(): ServerEnv {
  return validateServerEnv();
}

/**
 * Gets validated client environment variables
 */
export function getClientEnv(): ClientEnv {
  return validateClientEnv();
}
