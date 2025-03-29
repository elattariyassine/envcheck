# EnvCheck

[![npm package][npm-img]][npm-url]
[![Build Status][build-img]][build-url]
[![Downloads][downloads-img]][downloads-url]
[![Issues][issues-img]][issues-url]
[![Code Coverage][codecov-img]][codecov-url]
[![Commitizen Friendly][commitizen-img]][commitizen-url]
[![Semantic Release][semantic-release-img]][semantic-release-url]

> A CLI tool that validates environment variables against `.env.example` and helps fix any issues.

## Features

- 🔍 Validate environment variables against `.env.example`
- 🛠️ Interactive mode to fix missing or invalid variables
- 📝 Support for different variable types (string, number, boolean)
- 🎨 Colorized output for better readability
- 🔒 Secure handling of sensitive information

## Installation

You can use EnvCheck in two ways:

### 1. Using npx (Recommended for one-time use)

```bash
npx envcheck init
npx envcheck validate
npx envcheck fix
```

### 2. Global Installation

```bash
npm install -g envcheck
```

After global installation, you can use the commands directly:

```bash
envcheck init
envcheck validate
envcheck fix
```

## Usage

### Initialize Environment Files

```bash
npx envcheck init
```

This command will:

1. Create a new `.env.example` file with common environment variables
2. Include examples for different types of variables (string, number, boolean)
3. Add helpful comments for each section

### Validate Environment Variables

```bash
npx envcheck validate
```

This command will:

1. Read your `.env` and `.env.example` files
2. Validate all required variables
3. Check variable types and formats
4. Display any errors or warnings

### Fix Environment Variables

```bash
npx envcheck fix
```

This command will:

1. Check for missing or invalid variables
2. Prompt you to enter values for missing variables (in interactive mode)
3. Update your `.env` file with the new values

### Command Options

```bash
# Skip confirmation prompts
npx envcheck fix --yes

# Force overwrite existing values
npx envcheck fix --force

# Show help for any command
npx envcheck --help
npx envcheck validate --help
npx envcheck fix --help
```

## Example Files

### .env.example

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=myapp
DB_USER=postgres
DB_PASSWORD=your_password

# API Configuration
API_URL=https://api.example.com
API_KEY=your_api_key
API_TIMEOUT=5000

# Feature Flags
DEBUG_MODE=false
ENABLE_CACHE=true

# Email Configuration
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Logging Configuration
LOG_LEVEL=info
LOG_FILE=app.log

# Security Configuration
JWT_SECRET=your_jwt_secret
SESSION_TIMEOUT=3600
```

### .env (with some invalid values)

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=not-a-number
DB_NAME=myapp
DB_USER=postgres
DB_PASSWORD=secret123

# API Configuration
API_URL=not-a-url
API_KEY=abc123
API_TIMEOUT=5000

# Feature Flags
DEBUG_MODE=not-a-boolean
ENABLE_CACHE=true

# Email Configuration
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Logging Configuration
LOG_LEVEL=info
LOG_FILE=app.log

# Security Configuration
JWT_SECRET=your_jwt_secret
SESSION_TIMEOUT=3600
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

ISC

[build-img]: https://github.com/elattariyassine/envcheck/actions/workflows/release.yml/badge.svg
[build-url]: https://github.com/elattariyassine/envcheck/actions/workflows/release.yml
[downloads-img]: https://img.shields.io/npm/dt/envcheck
[downloads-url]: https://www.npmtrends.com/envcheck
[npm-img]: https://img.shields.io/npm/v/envcheck
[npm-url]: https://www.npmjs.com/package/envcheck
[issues-img]: https://img.shields.io/github/issues/elattariyassine/envcheck
[issues-url]: https://github.com/elattariyassine/envcheck/issues
[codecov-img]: https://codecov.io/gh/elattariyassine/envcheck/branch/main/graph/badge.svg
[codecov-url]: https://codecov.io/gh/elattariyassine/envcheck
[semantic-release-img]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg
[semantic-release-url]: https://github.com/semantic-release/semantic-release
[commitizen-img]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg
[commitizen-url]: http://commitizen.github.io/cz-cli/
