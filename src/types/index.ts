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
 * Database Room Model
 */
export interface Room {
  id: number;
  room_name: string;
  password_hash: string | null;
  creator_token: string;
  created_at: Date;
  expires_at: Date | null;
  max_participants: number;
  is_active: boolean;
}

/**
 * Room API Types
 */
export interface CreateRoomRequest {
  roomName: string;
  password?: string;
  maxParticipants?: number;
  expiresIn?: number; // minutes
}

export interface CreateRoomResponse {
  roomName: string;
  creatorToken: string;
  hasPassword: boolean;
}

export interface RoomInfoResponse {
  roomName: string;
  hasPassword: boolean;
  maxParticipants: number;
  isActive: boolean;
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
  requestId?: string;
  duration?: number;
  endpoint?: string;
  method?: string;
  statusCode?: number;
  userId?: string;
  ip?: string;
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}
