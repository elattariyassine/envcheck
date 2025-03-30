import { fix } from '../../commands/fix';
import { readEnvFile, writeEnvFile, mergeEnvFiles } from '../../file';
import { validateEnvFiles } from '../../validation';
import inquirer from 'inquirer';
import { EnvVar } from '../../types';

// Mock dependencies
jest.mock('../../file');
jest.mock('../../validation');
jest.mock('inquirer', () => ({
  prompt: jest.fn(),
}));
jest.mock('chalk', () => ({
  blue: (str: string) => str,
  green: (str: string) => str,
  yellow: (str: string) => str,
}));

describe('fix command', () => {
  const mockEnvFile = {
    variables: [
      { key: 'DB_HOST', value: 'localhost', description: 'Database host' },
      { key: 'DB_PORT', value: '5432', description: 'Database port' },
    ],
  };

  const mockExampleFile = {
    variables: [
      { key: 'DB_HOST', value: 'localhost', description: 'Database host' },
      { key: 'DB_PORT', value: '5432', description: 'Database port' },
      { key: 'DB_NAME', value: 'myapp', description: 'Database name' },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (readEnvFile as jest.Mock).mockResolvedValue(mockEnvFile);
    (writeEnvFile as jest.Mock).mockResolvedValue(undefined);
    (mergeEnvFiles as jest.Mock).mockImplementation((env, example) => ({
      variables: [
        ...env.variables,
        ...example.variables
          .filter(
            (v: EnvVar) => !env.variables.find((e: EnvVar) => e.key === v.key)
          )
          .map((v: EnvVar) => ({ ...v, value: '' })),
      ],
    }));
  });

  it('should handle valid environment files', async () => {
    (validateEnvFiles as jest.Mock).mockReturnValue({
      isValid: true,
      errors: [],
      warnings: [],
    });

    await fix({ file: '.env', example: '.env.example', interactive: false });

    expect(readEnvFile).toHaveBeenCalledTimes(2);
    expect(writeEnvFile).not.toHaveBeenCalled();
  });

  it('should handle missing variables in interactive mode', async () => {
    (validateEnvFiles as jest.Mock).mockReturnValue({
      isValid: false,
      errors: [
        {
          type: 'missing',
          key: 'DB_NAME',
          message: 'Missing required variable',
        },
      ],
      warnings: [],
    });

    (inquirer.prompt as unknown as jest.Mock).mockResolvedValueOnce({
      value: 'testdb',
    });

    await fix({ file: '.env', example: '.env.example', interactive: true });

    expect(inquirer.prompt).toHaveBeenCalledWith([
      expect.objectContaining({
        name: 'value',
        message: expect.stringContaining('DB_NAME'),
      }),
    ]);
    expect(writeEnvFile).toHaveBeenCalled();
  });

  it('should handle type mismatch errors in interactive mode', async () => {
    (validateEnvFiles as jest.Mock).mockReturnValue({
      isValid: false,
      errors: [
        { type: 'type_mismatch', key: 'DB_PORT', message: 'Invalid type' },
      ],
      warnings: [],
    });

    (inquirer.prompt as unknown as jest.Mock).mockResolvedValueOnce({
      value: '5432',
    });

    await fix({ file: '.env', example: '.env.example', interactive: true });

    expect(inquirer.prompt).toHaveBeenCalledWith([
      expect.objectContaining({
        name: 'value',
        message: expect.stringContaining('DB_PORT'),
      }),
    ]);
    expect(writeEnvFile).toHaveBeenCalled();
  });

  it('should skip fixing variables when interactive mode is disabled', async () => {
    (validateEnvFiles as jest.Mock).mockReturnValue({
      isValid: false,
      errors: [
        {
          type: 'missing',
          key: 'DB_NAME',
          message: 'Missing required variable',
        },
      ],
      warnings: [],
    });

    await fix({ file: '.env', example: '.env.example', interactive: false });

    expect(inquirer.prompt).not.toHaveBeenCalled();
    expect(writeEnvFile).toHaveBeenCalled();
  });

  it('should handle warnings without errors', async () => {
    (validateEnvFiles as jest.Mock).mockReturnValue({
      isValid: false,
      errors: [],
      warnings: [{ message: 'Warning: Unknown variable in .env' }],
    });

    await fix({ file: '.env', example: '.env.example', interactive: false });

    expect(writeEnvFile).toHaveBeenCalled();
  });

  it('should handle file read errors', async () => {
    (readEnvFile as jest.Mock).mockRejectedValueOnce(
      new Error('File not found')
    );

    await expect(
      fix({ file: '.env', example: '.env.example', interactive: false })
    ).rejects.toThrow('File not found');
  });

  it('should handle file write errors', async () => {
    (validateEnvFiles as jest.Mock).mockReturnValue({
      isValid: false,
      errors: [
        {
          type: 'missing',
          key: 'DB_NAME',
          message: 'Missing required variable',
        },
      ],
      warnings: [],
    });

    (writeEnvFile as jest.Mock).mockRejectedValueOnce(
      new Error('Write failed')
    );

    await expect(
      fix({ file: '.env', example: '.env.example', interactive: false })
    ).rejects.toThrow('Write failed');
  });

  it('should handle validation errors without matching variables', async () => {
    (validateEnvFiles as jest.Mock).mockReturnValue({
      isValid: false,
      errors: [
        {
          type: 'missing',
          key: 'NONEXISTENT',
          message: 'Missing required variable',
        },
      ],
      warnings: [],
    });

    await fix({ file: '.env', example: '.env.example', interactive: true });

    expect(inquirer.prompt).not.toHaveBeenCalled();
    expect(writeEnvFile).toHaveBeenCalled();
  });

  it('should handle merge errors', async () => {
    (mergeEnvFiles as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Merge failed');
    });

    await expect(
      fix({ file: '.env', example: '.env.example', interactive: false })
    ).rejects.toThrow('Merge failed');
  });

  it('should handle validation errors', async () => {
    (validateEnvFiles as jest.Mock).mockImplementationOnce(() => {
      throw new Error('Validation failed');
    });

    await expect(
      fix({ file: '.env', example: '.env.example', interactive: false })
    ).rejects.toThrow('Validation failed');
  });
});
