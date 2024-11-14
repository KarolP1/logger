import { LoggerProps } from "../types/Logger.type";

export class Logger {
    prefix: string;
    constructor(data: LoggerProps) {
        this.prefix = data.prefix ?? 'Logger';
    }
    log(message: any) {
        console.log(`[${this.prefix}] ${message}`);
    }

}