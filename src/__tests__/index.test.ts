import { Command } from 'commander';
import { init } from '../commands/init';
import { validate } from '../commands/validate';
import { fix } from '../commands/fix';

// Mock the command modules
jest.mock('../commands/init');
jest.mock('../commands/validate');
jest.mock('../commands/fix');

describe('CLI Commands', () => {
  let program: Command;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Create a new Command instance for each test
    program = new Command();

    // Setup the commands manually instead of requiring index.ts
    program
      .name('envcheck')
      .description('CLI tool to validate environment variables')
      .version('1.0.0');

    program
      .command('init')
      .description('Initialize a new .env.example file')
      .action(async () => {
        try {
          await init();
        } catch (error) {
          if (error instanceof Error) {
            throw error;
          }
          throw new Error('An unknown error occurred');
        }
      });

    program
      .command('validate')
      .description('Validate environment variables against .env.example')
      .action(() => {
        try {
          validate();
        } catch (error) {
          if (error instanceof Error) {
            throw error;
          }
          throw new Error('An unknown error occurred');
        }
      });

    program
      .command('fix')
      .description('Fix environment variables based on .env.example')
      .option('-f, --file <path>', 'Path to .env file', '.env')
      .option(
        '-e, --example <path>',
        'Path to .env.example file',
        '.env.example'
      )
      .option(
        '-i, --interactive',
        'Enable interactive mode for fixing variables',
        true
      )
      .option(
        '--no-interactive',
        'Disable interactive mode for fixing variables'
      )
      .action(async options => {
        try {
          await fix(options);
        } catch (error) {
          if (error instanceof Error) {
            throw error;
          }
          throw new Error('An unknown error occurred');
        }
      });
  });

  describe('init command', () => {
    it('should call init function when init command is executed', async () => {
      // Mock the init function to resolve successfully
      (init as jest.Mock).mockResolvedValue(undefined);

      // Execute the init command
      await program.parseAsync(['node', 'index.js', 'init']);

      // Verify init was called
      expect(init).toHaveBeenCalledTimes(1);
    });

    it('should handle errors in init command', async () => {
      // Mock the init function to throw an error
      const error = new Error('Test error');
      (init as jest.Mock).mockRejectedValue(error);

      // Execute the init command and expect it to throw
      await expect(
        program.parseAsync(['node', 'index.js', 'init'])
      ).rejects.toThrow('Test error');
    });
  });

  describe('validate command', () => {
    it('should call validate function when validate command is executed', async () => {
      // Mock the validate function
      (validate as jest.Mock).mockReturnValue(undefined);

      // Execute the validate command
      await program.parseAsync(['node', 'index.js', 'validate']);

      // Verify validate was called
      expect(validate).toHaveBeenCalledTimes(1);
    });

    it('should handle errors in validate command', async () => {
      // Mock the validate function to throw an error
      const error = new Error('Test error');
      (validate as jest.Mock).mockImplementation(() => {
        throw error;
      });

      // Execute the validate command and expect it to throw
      await expect(
        program.parseAsync(['node', 'index.js', 'validate'])
      ).rejects.toThrow('Test error');
    });
  });

  describe('fix command', () => {
    it('should call fix function with default options when fix command is executed', async () => {
      // Mock the fix function
      (fix as jest.Mock).mockResolvedValue(undefined);

      // Execute the fix command
      await program.parseAsync(['node', 'index.js', 'fix']);

      // Verify fix was called with default options
      expect(fix).toHaveBeenCalledWith({
        file: '.env',
        example: '.env.example',
        interactive: true,
      });
    });

    it('should call fix function with custom options when provided', async () => {
      // Mock the fix function
      (fix as jest.Mock).mockResolvedValue(undefined);

      // Execute the fix command with custom options
      await program.parseAsync([
        'node',
        'index.js',
        'fix',
        '--file',
        'custom.env',
        '--example',
        'custom.example',
        '--no-interactive',
      ]);

      // Verify fix was called with custom options
      expect(fix).toHaveBeenCalledWith({
        file: 'custom.env',
        example: 'custom.example',
        interactive: false,
      });
    });

    it('should handle errors in fix command', async () => {
      // Mock the fix function to throw an error
      const error = new Error('Test error');
      (fix as jest.Mock).mockRejectedValue(error);

      // Execute the fix command and expect it to throw
      await expect(
        program.parseAsync(['node', 'index.js', 'fix'])
      ).rejects.toThrow('Test error');
    });
  });
});
