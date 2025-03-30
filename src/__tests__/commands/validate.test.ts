import fs from 'fs';
import { parse } from 'dotenv';
import { validate } from '../../commands/validate';

// Mock dependencies
jest.mock('fs');
jest.mock('dotenv');

describe('validate command', () => {
  const mockEnvContent = `
DB_HOST=localhost
DB_PORT=5432
DB_NAME=myapp
API_URL=https://api.example.com
DEBUG_MODE=true
`;

  const mockExampleContent = `
DB_HOST=localhost
DB_PORT=5432
DB_NAME=myapp
API_URL=https://api.example.com
DEBUG_MODE=false
`;

  beforeEach(() => {
    jest.clearAllMocks();
    (fs.existsSync as jest.Mock).mockReturnValue(true);
    (fs.readFileSync as jest.Mock).mockImplementation(path => {
      if (path === '.env') return mockEnvContent;
      if (path === '.env.example') return mockExampleContent;
      return '';
    });
  });

  it('should validate environment files successfully', () => {
    const mockParsedEnv = {
      DB_HOST: 'localhost',
      DB_PORT: '5432',
      DB_NAME: 'myapp',
      API_URL: 'https://api.example.com',
      DEBUG_MODE: 'true',
    };

    const mockParsedExample = {
      DB_HOST: 'localhost',
      DB_PORT: '5432',
      DB_NAME: 'myapp',
      API_URL: 'https://api.example.com',
      DEBUG_MODE: 'false',
    };

    (parse as jest.Mock)
      .mockReturnValueOnce(mockParsedEnv)
      .mockReturnValueOnce(mockParsedExample);

    expect(() => validate()).not.toThrow();
  });

  it('should throw error when .env file is missing', () => {
    (fs.existsSync as jest.Mock).mockImplementation(path => {
      if (path === '.env') return false;
      return true;
    });

    expect(() => validate()).toThrow('.env file not found');
  });

  it('should throw error when .env.example file is missing', () => {
    (fs.existsSync as jest.Mock).mockImplementation(path => {
      if (path === '.env.example') return false;
      return true;
    });

    expect(() => validate()).toThrow('.env.example file not found');
  });

  it('should detect missing required variables', () => {
    const mockParsedEnv = {
      DB_HOST: 'localhost',
      DB_PORT: '5432',
    };

    const mockParsedExample = {
      DB_HOST: 'localhost',
      DB_PORT: '5432',
      DB_NAME: 'myapp',
      API_URL: 'https://api.example.com',
    };

    (parse as jest.Mock)
      .mockReturnValueOnce(mockParsedEnv)
      .mockReturnValueOnce(mockParsedExample);

    expect(() => validate()).toThrow('Environment validation failed');
  });

  it('should detect invalid boolean values', () => {
    const mockParsedEnv = {
      DB_HOST: 'localhost',
      DB_PORT: '5432',
      DB_NAME: 'myapp',
      API_URL: 'https://api.example.com',
      DEBUG_MODE: 'invalid',
    };

    const mockParsedExample = {
      DB_HOST: 'localhost',
      DB_PORT: '5432',
      DB_NAME: 'myapp',
      API_URL: 'https://api.example.com',
      DEBUG_MODE: 'false',
    };

    (parse as jest.Mock)
      .mockReturnValueOnce(mockParsedEnv)
      .mockReturnValueOnce(mockParsedExample);

    expect(() => validate()).toThrow('Environment validation failed');
  });

  it('should detect invalid numeric values', () => {
    const mockParsedEnv = {
      DB_HOST: 'localhost',
      DB_PORT: 'not-a-number',
      DB_NAME: 'myapp',
      API_URL: 'https://api.example.com',
      DEBUG_MODE: 'false',
    };

    const mockParsedExample = {
      DB_HOST: 'localhost',
      DB_PORT: '5432',
      DB_NAME: 'myapp',
      API_URL: 'https://api.example.com',
      DEBUG_MODE: 'false',
    };

    (parse as jest.Mock)
      .mockReturnValueOnce(mockParsedEnv)
      .mockReturnValueOnce(mockParsedExample);

    expect(() => validate()).toThrow('Environment validation failed');
  });

  it('should detect invalid URL values', () => {
    const mockParsedEnv = {
      DB_HOST: 'localhost',
      DB_PORT: '5432',
      DB_NAME: 'myapp',
      API_URL: 'not-a-url',
      DEBUG_MODE: 'false',
    };

    const mockParsedExample = {
      DB_HOST: 'localhost',
      DB_PORT: '5432',
      DB_NAME: 'myapp',
      API_URL: 'https://api.example.com',
      DEBUG_MODE: 'false',
    };

    (parse as jest.Mock)
      .mockReturnValueOnce(mockParsedEnv)
      .mockReturnValueOnce(mockParsedExample);

    expect(() => validate()).toThrow('Environment validation failed');
  });

  it('should detect empty required values', () => {
    const mockParsedEnv = {
      DB_HOST: 'localhost',
      DB_PORT: '5432',
      DB_NAME: '',
      API_URL: 'https://api.example.com',
      DEBUG_MODE: 'false',
    };

    const mockParsedExample = {
      DB_HOST: 'localhost',
      DB_PORT: '5432',
      DB_NAME: 'myapp',
      API_URL: 'https://api.example.com',
      DEBUG_MODE: 'false',
    };

    (parse as jest.Mock)
      .mockReturnValueOnce(mockParsedEnv)
      .mockReturnValueOnce(mockParsedExample);

    expect(() => validate()).toThrow('Environment validation failed');
  });

  it('should handle unknown variables in .env', () => {
    const mockParsedEnv = {
      DB_HOST: 'localhost',
      DB_PORT: '5432',
      DB_NAME: 'myapp',
      API_URL: 'https://api.example.com',
      DEBUG_MODE: 'false',
      UNKNOWN_VAR: 'value',
    };

    const mockParsedExample = {
      DB_HOST: 'localhost',
      DB_PORT: '5432',
      DB_NAME: 'myapp',
      API_URL: 'https://api.example.com',
      DEBUG_MODE: 'false',
    };

    (parse as jest.Mock)
      .mockReturnValueOnce(mockParsedEnv)
      .mockReturnValueOnce(mockParsedExample);

    expect(() => validate()).not.toThrow();
  });
});
