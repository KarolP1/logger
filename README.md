# Logger

A customizable and easy-to-use logging library for Node.js. This logger supports multiple log levels, custom colors, file logging, and even formatting tables for better visualization. You can tailor its behavior to fit your needs, such as muting logs or adjusting the log level dynamically.
## Features

 - Supports multiple log levels: LOG, INFO, WARN, ERROR, DEBUG.
 - Customizable colors for different log levels and table headers/cells.
 - Logs are saved to files, with separate logs for different levels.
 - Option to mute logs or adjust the minimum log level.
 - Formats tables for better readability when logging structured data.
 - Compatible with both simple console logs and file-based logging.
## Installation

To install the package, use the following command:

```bash
npm install @platek549/logger
```

## Usage

Basic Example

```javascript
import { Logger } from '@platek549/logger';

// Create a new logger instance with custom options
const logger = new Logger({
    prefix: 'MyApp',
    logLevel: 'DEBUG', // Set the minimum log level
    colors: {
        log: '#00FF00',
        info: '#0000FF',
        warn: '#FFFF00',
        error: '#FF0000',
        tableHeader: '#FFFFFF',
        tableCell: '#FF6347', // Tomato color for table cells
    },
    paths: {
        all: './logs/all.log',
        error: './logs/error.log',
        warn: './logs/warn.log',
        info: './logs/info.log',
        log: './logs/log.log',
        debug: './logs/debug.log',
    }
});

// Log different types of messages
logger.log('This is a regular log message');
logger.info('This is an info message');
logger.warn('This is a warning');
logger.error('This is an error');
logger.debug('This is a debug message');

// Logging a table
const users = [
    { name: 'John', age: 30 },
    { name: 'Jane', age: 25 }
];

logger.table(users);
```

## Example Output
[2024-11-16T15:56:59.018Z][MyApp - LOG] This is a regular log message
[2024-11-16T15:56:59.018Z][MyApp - INFO] This is an info message
[2024-11-16T15:56:59.018Z][MyApp - WARN] This is a warning
[2024-11-16T15:56:59.018Z][MyApp - ERROR] This is an error
[2024-11-16T15:56:59.018Z][MyApp - DEBUG] This is a debug message

[2024-11-16T15:56:59.018Z][MyApp - INFO] 
╔══════╤═════╗
║ name │ age ║
╟──────┼─────╢
║ John │ 30  ║
╟──────┼─────╢
║ Jane │ 25  ║
╚══════╧═════╝

## Changing Log Level

You can change the log level dynamically:

```javascript
logger.setLogLevel('INFO'); // Only logs messages of INFO level and above
```
## Mute and Unmute Logs
```javascript
logger.mute();  // Mute all logs
logger.unmute();  // Unmute logs
```

## Customize Colors

```javascript
logger.updateColors({
    log: '#32CD32', // Lime green for regular logs
    info: '#1E90FF', // Dodger blue for info messages
});
```

## Options
The logger accepts the following configuration options:

```js
{
    prefix: string; // Prefix for the log messages, default is 'Logger'
    logLevel: 'LOG' | 'INFO' | 'WARN' | 'ERROR' | 'DEBUG'; // Minimum log level (default: 'DEBUG')
    colors: {
        log: string; // Color for regular logs (hex format)
        info: string; // Color for info messages (hex format)
        warn: string; // Color for warning messages (hex format)
        error: string; // Color for error messages (hex format)
        tableHeader: string; // Color for table headers (hex format)
        tableCell: string; // Color for table cells (hex format)
    };
    paths: {
        all: string; // Path to save all logs
        error: string; // Path to save error logs
        warn: string; // Path to save warning logs
        info: string; // Path to save info logs
        log: string; // Path to save regular logs
        debug: string; // Path to save debug logs
    };
    muteLogs: boolean; // Whether to mute logs (default: false)
}
```
## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.