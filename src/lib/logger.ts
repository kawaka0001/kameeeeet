import { LogLevel, LogEntry, LogContext } from "@/types";

/**
 * Logger class for structured logging with enhanced debugging capabilities
 */
class Logger {
  private isDevelopment = process.env.NODE_ENV === "development";

  /**
   * Generate a unique request ID for tracing
   */
  generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Create a performance timer that returns elapsed time in ms
   */
  startTimer(): () => number {
    const start = performance.now();
    return () => Math.round(performance.now() - start);
  }

  /**
   * Formats log entry as JSON for production
   */
  private formatLog(entry: LogEntry): string {
    return JSON.stringify(entry);
  }

  /**
   * Creates a log entry with enhanced error information
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
            stack: this.isDevelopment ? error.stack : undefined,
          }
        : undefined,
    };
  }

  /**
   * Logs a message with enhanced formatting
   */
  private log(
    level: LogLevel,
    message: string,
    context?: LogContext,
    error?: Error
  ): void {
    const entry = this.createLogEntry(level, message, context, error);

    if (this.isDevelopment) {
      // Development: Pretty print with colors and context
      const timestamp = entry.timestamp;
      const levelLabel = level.toUpperCase();
      const requestId = context?.requestId ? `[${context.requestId}]` : "";

      let logMessage = `[${timestamp}] [${levelLabel}] ${requestId} ${message}`;

      if (context) {
        const { requestId: _, ...otherContext } = context;
        if (Object.keys(otherContext).length > 0) {
          logMessage += `\n  Context: ${JSON.stringify(otherContext, null, 2)}`;
        }
      }

      if (error) {
        logMessage += `\n  ❌ Error: ${error.name}: ${error.message}`;
        if (error.stack) {
          logMessage += `\n  Stack:\n${error.stack.split('\n').map(line => `    ${line}`).join('\n')}`;
        }
      }

      // Use appropriate console method
      const consoleMethod = level === LogLevel.ERROR ? console.error :
                           level === LogLevel.WARN ? console.warn :
                           level === LogLevel.DEBUG ? console.debug :
                           console.log;

      consoleMethod(logMessage);
    } else {
      // Production: JSON format for log aggregation
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
