export type LoggerProps = {
    remoteLogUrl?: string;
    prefix?: string;
    logLevel?: LogLevel;
    colors?: {
        log?: string;
        info?: string;
        warn?: string;
        error?: string;
        debug?: string;
        tableHeader?: string;
        tableCell?: string;
    }
    paths?: {
        all?: string;
        error?: string;
        warn?: string;
        info?: string;
        log?: string;
        debug?: string;
    }
    muteLogs?: boolean;
    categories?: Record<string, boolean>;
    maxLogFileSize?: number;
};

export type LogLevel = 'DEBUG' | 'LOG' | 'INFO' | 'WARN' | 'ERROR';

export const logLevelPriority: Record<LogLevel, number> = {
    DEBUG: 0,
    LOG: 1,
    INFO: 2,
    WARN: 3,
    ERROR: 4,
};
