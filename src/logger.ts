import type { LogEntry, LoggerOptions, LogLevel } from './types.ts';

// Internal mapping of log levels to numeric priorities for comparison.
// Higher numbers indicate higher severity.
const LEVEL_PRIORITY: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
    critical: 4,
};

/**
 * @description A configurable logger class for structured logging in Deno applications.
 * Supports log levels, contextual data, and custom outputs for production observability.
 *
 * @example
 * ```ts
 * const logger = new Logger({
 *      minLevel: 'info',
 *      serviceName: 'service-name',
 *      env: 'prod',
 *      output(entry) {
 *          console.log(entry);
 *      }
 * });
 *
 * logger.info('Event occurred', { key: 'value' });
 * ```
 *
 * @example
 * ```json
 * {"timestamp":"2025-08-14T15:04:51.512Z","level":"info","message":"Event occurred","env":"prod","service":"service-name","key":"value"}
 *
 * {
 *      timestamp: "2025-08-14T17:57:23.200Z",
 *      level: "info",
 *      message: "Event occurred",
 *      env: "prod",
 *      service: "service-name",
 *      key: "value"
 * }
 * ```
 */
export class Logger {
    private minPriority: number;
    private service: string | undefined;
    private env: string;
    private output: (entry: LogEntry) => void;

    /**
     * Initializes the logger with optional configuration.
     *
     * @description A configurable logger class for structured logging in Deno applications.
     * Supports log levels, contextual data, and custom outputs for production observability.
     *
     * @param {LoggerOptions} options - Configuration for log level, service, environment, and output.
     *
     * @example
     * ```ts
     * const logger = new Logger({
     *      minLevel: 'info',
     *      serviceName: 'service-name',
     *      env: 'prod',
     *      output(entry) {
     *          console.log(entry);
     *      }
     * });
     *
     * logger.info('Event occurred', { key: 'value' });
     * ```
     *
     * @example
     * ```json
     * {"timestamp":"2025-08-14T15:04:51.512Z","level":"info","message":"Event occurred","env":"prod","service":"service-name","key":"value"}
     *
     * {
     *      timestamp: "2025-08-14T17:57:23.200Z",
     *      level: "info",
     *      message: "Event occurred",
     *      env: "prod",
     *      service: "service-name",
     *      key: "value"
     * }
     * ```
     */
    constructor(options: LoggerOptions = {}) {
        /**
         * Set minimum priority based on provided level or defaults to 'info'.
         */
        this.minPriority = LEVEL_PRIORITY[options.minLevel ?? 'info'];

        this.service = options.serviceName;

        /**
         * Fallback to DENO_ENV environment variable if not provided, defaulting to 'dev' for safety.
         */
        this.env = options.env ?? Deno.env.get('DENO_ENV') ?? 'dev';

        /**
         * Default to JSON-stringified console output; can be overridden for custom transports.
         */
        this.output = options.output ??
            ((entry: LogEntry) => console.log(JSON.stringify(entry)));
    }

    /**
     * Internal method to create and output a log entry if it meets the minimum level.
     * @param level - The log level.
     * @param message - The log message.
     * @param data - Optional additional data to include in the log.
     */
    private log(
        level: LogLevel,
        message: string,
        data: Record<string, unknown> = {},
    ): void {
        /**
         * Skip logging if below minimum priority to optimize performance.
         */
        if (LEVEL_PRIORITY[level] < this.minPriority) return;

        const entry: LogEntry = {
            timestamp: new Date().toISOString(), // Use ISO format for universal compatibility.
            level,
            message,
            env: this.env,
            service: this.service,
            ...data, // Spread additional data for flexibility.
        };

        /**
         * Output the entry; errors are swallowed to prevent app crashes in production.
         */
        this.output(entry);
    }

    /**
     * Logs a debug message (lowest priority, for development use).
     * @param message - The log message.
     * @param data - Optional contextual data.
     * @example logger.debug("message", { key: "value" });
     */
    debug(message: string, data?: Record<string, unknown>): void {
        this.log('debug', message, data);
    }

    /**
     * Logs an info message (general information).
     * @param message - The log message.
     * @param data - Optional contextual data.
     * @example logger.info("message", { key: "value" });
     */
    info(message: string, data?: Record<string, unknown>): void {
        this.log('info', message, data);
    }

    /**
     * Logs a warning message (potential issues).
     * @param message - The log message.
     * @param data - Optional contextual data.
     * @example logger.warn("message", { key: "value" });
     */
    warn(message: string, data?: Record<string, unknown>): void {
        this.log('warn', message, data);
    }

    /**
     * Logs an error message (failures that need attention).
     * @param message - The log message.
     * @param data - Optional contextual data (e.g., stack traces).
     * @example logger.error("message", { key: "value" });
     */
    error(message: string, data?: Record<string, unknown>): void {
        this.log('error', message, data);
    }

    /**
     * @description Logs a critical message (severe issues affecting the system).
     * @param message - The log message.
     * @param data - Optional contextual data.
     * @example logger.critical("message", { key: "value" });
     */
    critical(message: string, data?: Record<string, unknown>): void {
        this.log('critical', message, data);
    }
}
