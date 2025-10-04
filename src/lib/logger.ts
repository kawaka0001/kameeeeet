import { LogLevel, LogEntry, LogContext } from "@/types";

/**
 * Logger class for structured logging
 */
class Logger {
  private isDevelopment = process.env.NODE_ENV === "development";

  /**
   * Formats log entry as JSON
   */
  private formatLog(entry: LogEntry): string {
    return JSON.stringify(entry);
  }

  /**
   * Creates a log entry
   */
  private createLogEntry(
    level: LogLevel,
    message: string,
    context?: LogContext,
    error?: Error
  ): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      error: error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : undefined,
    };
  }

  /**
   * Logs a message
   */
  private log(
    level: LogLevel,
    message: string,
    context?: LogContext,
    error?: Error
  ): void {
    const entry = this.createLogEntry(level, message, context, error);

    if (this.isDevelopment) {
      // Development: Pretty print
      const prefix = `[${entry.timestamp}] [${level.toUpperCase()}]`;
      console.log(prefix, message, context || "", error || "");
    } else {
      // Production: JSON format
      console.log(this.formatLog(entry));
    }
  }

  debug(message: string, context?: LogContext): void {
    this.log(LogLevel.DEBUG, message, context);
  }

  info(message: string, context?: LogContext): void {
    this.log(LogLevel.INFO, message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.log(LogLevel.WARN, message, context);
  }

  error(message: string, error?: Error, context?: LogContext): void {
    this.log(LogLevel.ERROR, message, context, error);
  }
}

// Export singleton instance
export const logger = new Logger();
