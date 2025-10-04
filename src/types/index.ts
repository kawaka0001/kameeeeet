/**
 * Type definitions for the Meet application
 */

/**
 * API Response Types
 */
export interface TokenResponse {
  token: string;
}

export interface ErrorResponse {
  error: string;
  details?: string;
}

/**
 * Room Types
 */
export interface RoomConfig {
  roomName: string;
  participantName: string;
}

/**
 * Environment Variables
 */
export interface ServerEnv {
  LIVEKIT_API_KEY: string;
  LIVEKIT_API_SECRET: string;
}

export interface ClientEnv {
  NEXT_PUBLIC_LIVEKIT_URL: string;
}

/**
 * Logging Types
 */
export enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
}

export interface LogContext {
  [key: string]: unknown;
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: Error;
}
