/**
 * Defines the supported log levels for the logger.
 * Levels are ordered by priority: debug (lowest) to critical (highest).
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'critical';

/**
 * Represents a single log entry in structured JSON format.
 * This format is optimized for ingestion by cloud logging systems like AWS CloudWatch or GCP Cloud Logging.
 */
export interface LogEntry {
    /**
     * ISO 8601 timestamp of when the log was created.
     */
    timestamp: string;

    /**
     * The log level (e.g., 'info', 'error').
     */
    level: LogLevel;

    /** The primary log message. */
    message: string;

    /** The environment (e.g., 'dev', 'prod'). */
    env: string;

    /** Optional service name for microservices architectures. */
    service?: string;

    /** Additional key-value pairs for contextual data (e.g., { userId: 123 }). */
    [key: string]: unknown;
}

/**
 * Configuration options for initializing the Logger.
 */
export interface LoggerOptions {
    /**
     * @description
     * Minimum log level to output. Logs below this level are ignored.
     * @example
     * ```ts
     * const logger = new Logger({
     *      minLevel: 'info'
     * });
     * ```
     * @param { options }
     *      - debug
     *      - info
     *      - warn
     *      - error
     *      - critical
     * @default 'info'
     */
    minLevel?: LogLevel;

    /**
     * @description
     * Optional service name to include in all logs
     * @example
     * ```ts
     * const logger = new Logger({
     *      serviceName: 'service-name'
     * });
     * ```
     */
    serviceName?: string;

    /**
     * @description
     * Environment name (default: Deno.env.get('DENO_ENV') || 'dev')
     * @example
     * ```ts
     * const logger = new Logger({
     *      env: 'prod'
     * });
     * ```
     */
    env?: string;

    /**
     * @description
     * Custom output function for logs (default: console.log as JSON). Use for custom transports like remote sinks.
     * @example
     * ```ts
     * const logger = new Logger({
     *      output(entry) {
     *          console.log(entry);
     *      },
     * });
     * ```
     */
    output?: (entry: LogEntry) => void;
}
