import { readEnvFile, writeEnvFile, mergeEnvFiles } from '../file';
import { EnvFile, EnvVar } from '../types';
import fs from 'fs-extra';

jest.mock('fs-extra');

const mockedFs = jest.mocked(fs, { shallow: false });

describe('File Operations', () => {
  const mockEnvContent = `DB_HOST=localhost
DB_PORT=5432
DB_NAME=myapp
DB_USER=postgres
DB_PASSWORD=secret123
API_URL=https://api.example.com
API_KEY=abc123
API_TIMEOUT=5000
ENABLE_CACHE=true
DEBUG_MODE=false`;

  const mockVariables: EnvVar[] = [
    { key: 'DB_HOST', value: 'localhost', type: 'string', required: true },
    { key: 'DB_PORT', value: '5432', type: 'number', required: true },
    { key: 'DB_NAME', value: 'myapp', type: 'string', required: true },
    { key: 'DB_USER', value: 'postgres', type: 'string', required: true },
    { key: 'DB_PASSWORD', value: 'secret123', type: 'string', required: true },
    {
      key: 'API_URL',
      value: 'https://api.example.com',
      type: 'string',
      required: true,
    },
    { key: 'API_KEY', value: 'abc123', type: 'string', required: true },
    { key: 'API_TIMEOUT', value: '5000', type: 'number', required: true },
    { key: 'ENABLE_CACHE', value: 'true', type: 'boolean', required: true },
    { key: 'DEBUG_MODE', value: 'false', type: 'boolean', required: true },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockedFs.pathExists.mockImplementation(async () => true);
    mockedFs.readFile.mockImplementation(async () => mockEnvContent);
  });

  describe('readEnvFile', () => {
    it('should read and parse env file correctly', async () => {
      const result = await readEnvFile('.env');
      expect(result).toMatchObject({
        path: '.env',
        variables: mockVariables.map(({ type, ...rest }) => rest),
      });
      expect(result.lines).toEqual(mockEnvContent.split('\n'));
      expect(mockedFs.pathExists).toHaveBeenCalledWith(
        expect.stringContaining('.env')
      );
      expect(mockedFs.readFile).toHaveBeenCalledWith(
        expect.stringContaining('.env'),
        'utf-8'
      );
    });

    it('should throw error if file does not exist', async () => {
      mockedFs.pathExists.mockImplementation(async () => false);
      await expect(readEnvFile('.env')).rejects.toThrow(
        'Environment file not found'
      );
    });

    it('should throw error if file read fails', async () => {
      mockedFs.readFile.mockImplementation(async () => {
        throw new Error('Read failed');
      });
      await expect(readEnvFile('.env')).rejects.toThrow(
        'Failed to read environment file'
      );
    });
  });

  describe('writeEnvFile', () => {
    it('should write env file correctly', async () => {
      mockedFs.writeFile.mockImplementation(async () => {});
      await writeEnvFile('.env', mockVariables);
      expect(mockedFs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('.env'),
        mockEnvContent,
        'utf-8'
      );
    });

    it('should write env file with example formatting', async () => {
      mockedFs.writeFile.mockImplementation(async () => {});
      mockedFs.readFile.mockImplementation(async () => mockEnvContent);
      await writeEnvFile('.env', mockVariables, '.env.example');
      expect(mockedFs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('.env'),
        mockEnvContent,
        'utf-8'
      );
      expect(mockedFs.readFile).toHaveBeenCalledWith(
        expect.stringContaining('.env.example'),
        'utf-8'
      );
    });

    it('should throw error if file write fails', async () => {
      mockedFs.writeFile.mockImplementation(async () => {
        throw new Error('Write failed');
      });
      await expect(writeEnvFile('.env', mockVariables)).rejects.toThrow(
        'Failed to write environment file'
      );
    });
  });
});

describe('mergeEnvFiles', () => {
  const envFile: EnvFile = {
    path: '.env',
    variables: [
      {
        key: 'DB_HOST',
        value: 'localhost',
        required: true,
      },
      {
        key: 'DB_PORT',
        value: '5432',
        required: true,
      },
    ],
  };

  const exampleFile: EnvFile = {
    path: '.env.example',
    variables: [
      {
        key: 'DB_HOST',
        value: 'localhost',
        required: true,
        type: 'string',
        description: 'Database host',
      },
      {
        key: 'DB_PORT',
        value: '5432',
        required: true,
        type: 'number',
        description: 'Database port',
      },
      {
        key: 'DB_NAME',
        value: 'myapp',
        required: true,
        type: 'string',
        description: 'Database name',
      },
    ],
  };

  it('should merge env files correctly', () => {
    const result = mergeEnvFiles(envFile, exampleFile);

    expect(result.variables).toHaveLength(3);
    expect(result.variables[0]).toEqual({
      key: 'DB_HOST',
      value: 'localhost',
      required: true,
      type: 'string',
      description: 'Database host',
    });
    expect(result.variables[1]).toEqual({
      key: 'DB_PORT',
      value: '5432',
      required: true,
      type: 'number',
      description: 'Database port',
    });
    expect(result.variables[2]).toEqual({
      key: 'DB_NAME',
      value: '',
      required: true,
      type: 'string',
      description: 'Database name',
    });
  });
});
