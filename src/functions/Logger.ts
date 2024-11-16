import chalk from 'chalk';
import { LoggerProps, LogLevel, logLevelPriority } from '../types/Logger.type';
import fs from 'fs';
import path from 'path';
import util from 'util';
import { table } from 'table';
// import stripAnsi from 'strip-ansi';

export class Logger {
    private prefix: string;
    private COLOR_LOG: string;
    private COLOR_INFO: string;
    private COLOR_WARN: string;
    private COLOR_ERROR: string;
    private COLOR_TABLE_HEADER: string;
    private COLOR_TABLE_CELL: string;
    private currentLogLevel: LogLevel;
    private logFilePath_error: string | undefined;
    private logFilePath_warn: string | undefined;
    private logFilePath_info: string | undefined;
    private logFilePath_log: string | undefined;
    private logFilePath_debug: string | undefined;
    private muteLogs: boolean;
    private maxLogFileSize: number;
    private isWriting: boolean;

    constructor(data: LoggerProps) {
        this.prefix = data.prefix ?? 'Logger';
        this.COLOR_LOG = data.colors?.log ?? '#00FF00';
        this.COLOR_INFO = data.colors?.info ?? '#0000FF';
        this.COLOR_WARN = data.colors?.warn ?? '#FFFF00';
        this.COLOR_ERROR = data.colors?.error ?? '#FF0000';
        this.COLOR_TABLE_HEADER = data.colors?.tableHeader ?? '#FFFFFF';
        this.COLOR_TABLE_CELL = data.colors?.tableCell ?? '#FFFFFF';

        this.logFilePath_error = data.paths?.error;
        this.logFilePath_warn = data.paths?.warn;
        this.logFilePath_info = data.paths?.info;
        this.logFilePath_log = data.paths?.log;
        this.logFilePath_debug = data.paths?.debug;
        this.currentLogLevel = data.logLevel ?? 'DEBUG';
        this.muteLogs = data.muteLogs ?? false;
        this.maxLogFileSize = data.maxLogFileSize ?? 5 * 1024 * 1024; // Default: 5MB max file size
        this.isWriting = false; // Ensure sequential writes
    }

    // Method to check and rotate log files if necessary
    private async ensureDirectoryExistence(filePath: string) {
        const dir = path.dirname(filePath);
        try {
            await fs.promises.mkdir(dir, { recursive: true });
        } catch (error) {
            console.error(chalk.red(`[Logger Error]: Failed to create directory - ${error}`));
        }
    }

    private async rotateLogFile(filePath: string) {
        try {
            // Ensure the directory exists before checking the file size
            await this.ensureDirectoryExistence(filePath);

            const stats = await fs.promises.stat(filePath);
            if (stats.size >= this.maxLogFileSize) {
                const newFilePath = `${filePath}.${Date.now()}`;
                await fs.promises.rename(filePath, newFilePath);
                console.log(chalk.yellow(`[Logger]: Log file rotated - ${filePath}`));
            }
        } catch (error: any) {
            if (error.code === 'ENOENT') {
                // File doesn't exist yet, which is okay
                console.log(chalk.yellow(`[Logger]: Log file doesn't exist, no rotation needed - ${filePath}`));
            } else {
                console.error(chalk.red(`[Logger Error]: Failed to rotate log file - ${error}`));
            }
        }
    }

    private async saveToFile(level: LogLevel, message: string) {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}][${this.prefix} - ${level}] ${message} \n`;
        const stripAnsi = (await import('strip-ansi')).default;  // Using dynamic import
        const logMessageWithoutColor = stripAnsi(logMessage);
        try {
            // Ensure directories exist before rotating or writing logs
            if (level === 'ERROR' && this.logFilePath_error) await this.ensureDirectoryExistence(this.logFilePath_error);
            if (level === 'WARN' && this.logFilePath_warn) await this.ensureDirectoryExistence(this.logFilePath_warn);
            if (level === 'INFO' && this.logFilePath_info) await this.ensureDirectoryExistence(this.logFilePath_info);
            if (level === 'LOG' && this.logFilePath_log) await this.ensureDirectoryExistence(this.logFilePath_log);
            if (level === 'DEBUG' && this.logFilePath_debug) await this.ensureDirectoryExistence(this.logFilePath_debug);

            // Now rotate log files and save logs
            if (level === 'ERROR' && this.logFilePath_error) await this.rotateLogFile(this.logFilePath_error);
            if (level === 'WARN' && this.logFilePath_warn) await this.rotateLogFile(this.logFilePath_warn);
            if (level === 'INFO' && this.logFilePath_info) await this.rotateLogFile(this.logFilePath_info);
            if (level === 'LOG' && this.logFilePath_log) await this.rotateLogFile(this.logFilePath_log);
            if (level === 'DEBUG' && this.logFilePath_debug) await this.rotateLogFile(this.logFilePath_debug);

            // Write the log message
            if (level === 'ERROR' && this.logFilePath_error) await fs.promises.appendFile(this.logFilePath_error, logMessageWithoutColor, 'utf8');
            if (level === 'WARN' && this.logFilePath_warn) await fs.promises.appendFile(this.logFilePath_warn, logMessageWithoutColor, 'utf8');
            if (level === 'INFO' && this.logFilePath_info) await fs.promises.appendFile(this.logFilePath_info, logMessageWithoutColor, 'utf8');
            if (level === 'LOG' && this.logFilePath_log) await fs.promises.appendFile(this.logFilePath_log, logMessageWithoutColor, 'utf8');
            if (level === 'DEBUG' && this.logFilePath_debug) await fs.promises.appendFile(this.logFilePath_debug, logMessageWithoutColor, 'utf8');
        } catch (error) {
            console.error(chalk.red(`[Logger Error]: Failed to write log - ${error}`));
        }
    }

    private shouldLog(level: LogLevel): boolean {
        return !this.muteLogs && logLevelPriority[level] >= logLevelPriority[this.currentLogLevel];
    }



    private formatMessage(color: string, level: LogLevel, message: any): string {
        const formattedMessage = typeof message === 'object' ? util.inspect(message, { depth: null, colors: true }) : message;
        return chalk.hex(color)(`[${this.prefix} - ${level}] ${formattedMessage}`);
    }

    private formatTable(level: LogLevel, message: any): string {
        if (Array.isArray(message) && message.length > 0 && typeof message[0] === 'object') {
            // Apply color to the table headers and cells
            const headers = Object.keys(message[0]).map(header => chalk.bold.hex(this.COLOR_TABLE_HEADER)(header));  // Color header
            const rows = message.map((obj: any) =>
                Object.values(obj).map((value: any) => chalk.hex(this.COLOR_TABLE_CELL)(value)) // Color cell values
            );

            const tableData = [headers, ...rows];
            return table(tableData);
        }
        return JSON.stringify(message);
    }

    log(message: any) {
        if (this.shouldLog('LOG')) {
            const formattedMessage = this.formatMessage(this.COLOR_LOG, 'LOG', message);
            console.log(formattedMessage);
            this.saveToFile('LOG', formattedMessage);
        }
    }

    info(message: any) {
        if (this.shouldLog('INFO')) {
            const formattedMessage = this.formatMessage(this.COLOR_INFO, 'INFO', message);
            console.log(formattedMessage);
            this.saveToFile('INFO', formattedMessage);
        }
    }

    warn(message: any) {
        if (this.shouldLog('WARN')) {
            const formattedMessage = this.formatMessage(this.COLOR_WARN, 'WARN', message);
            console.log(formattedMessage);
            this.saveToFile('WARN', formattedMessage);
        }
    }

    error(message: any) {
        if (this.shouldLog('ERROR')) {
            const formattedMessage = this.formatMessage(this.COLOR_ERROR, 'ERROR', message);
            console.log(formattedMessage);
            this.saveToFile('ERROR', formattedMessage);
        }
    }

    debug(message: any) {
        if (this.shouldLog('DEBUG')) {
            const formattedMessage = this.formatMessage('#808080', 'DEBUG', message);
            console.log(formattedMessage);
            this.saveToFile('DEBUG', formattedMessage);
        }
    }

    table(message: any) {
        if (this.shouldLog('INFO')) {
            const tableOutput = this.formatTable('INFO', message);
            console.log(tableOutput);
            this.saveToFile('INFO', '\n' + tableOutput);
        }
    }

    setLogLevel(level: LogLevel) {
        this.currentLogLevel = level;
    }

    mute() {
        this.muteLogs = true;
    }

    unmute() {
        this.muteLogs = false;
    }

    updateColors(colors?: Partial<LoggerProps['colors']>) {
        this.COLOR_LOG = colors?.log ?? this.COLOR_LOG;
        this.COLOR_INFO = colors?.info ?? this.COLOR_INFO;
        this.COLOR_WARN = colors?.warn ?? this.COLOR_WARN;
        this.COLOR_ERROR = colors?.error ?? this.COLOR_ERROR;
        this.COLOR_TABLE_HEADER = colors?.tableHeader ?? this.COLOR_TABLE_HEADER;
        this.COLOR_TABLE_CELL = colors?.tableCell ?? this.COLOR_TABLE_CELL;
    }
}