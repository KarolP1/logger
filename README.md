# Logger

A simple and customizable logging package for your development needs.

## Features

- Easy to use
- Customizable log levels
- Multiple output options (console, file, etc.)
- Lightweight and fast

## Installation

To install the package, use the following command:

```bash
npm install @platek549/logger
```

## Usage

Here's a basic example of how to use the logger:

```javascript
const Logger = require('@platek549/logger');

const logger = new Logger({
    level: 'info',
    output: 'console'
});

logger.info('This is an info message');
logger.error('This is an error message');
```

## Configuration

You can customize the logger by passing a configuration object:

```javascript
const logger = new Logger({
    level: 'debug',
    output: 'file',
    filePath: './logs/app.log'
});
```

## Log Levels

The available log levels are:

- `debug`
- `info`
- `warn`
- `error`

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.