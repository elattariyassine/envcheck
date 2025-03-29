import { Command } from 'commander';
import { init } from '../commands/init';
import { validate } from '../commands/validate';
import { fix } from '../commands/fix';

jest.mock('../commands/init');
jest.mock('../commands/validate');
jest.mock('../commands/fix');

const mockCommand = {
  name: jest.fn().mockReturnThis(),
  description: jest.fn().mockReturnThis(),
  version: jest.fn().mockReturnThis(),
  command: jest.fn().mockReturnThis(),
  action: jest.fn().mockReturnThis(),
  option: jest.fn().mockReturnThis(),
  parse: jest.fn().mockReturnThis(),
};

jest.mock('commander', () => ({
  Command: jest.fn(() => mockCommand),
}));

describe('CLI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Clear the module cache to ensure fresh instance
    jest.resetModules();
    // Import the main file which sets up the CLI
    require('../index');
  });

  it('should set up init command', () => {
    expect(mockCommand.command).toHaveBeenCalledWith('init');
    expect(mockCommand.description).toHaveBeenCalledWith(
      expect.stringContaining('Initialize')
    );
  });

  it('should set up validate command', () => {
    expect(mockCommand.command).toHaveBeenCalledWith('validate');
    expect(mockCommand.description).toHaveBeenCalledWith(
      expect.stringContaining('Validate')
    );
  });

  it('should set up fix command with options', () => {
    expect(mockCommand.command).toHaveBeenCalledWith('fix');
    expect(mockCommand.option).toHaveBeenCalledWith(
      '-f, --file <path>',
      expect.any(String),
      '.env'
    );
    expect(mockCommand.option).toHaveBeenCalledWith(
      '-e, --example <path>',
      expect.any(String),
      '.env.example'
    );
    expect(mockCommand.option).toHaveBeenCalledWith(
      '-i, --interactive',
      expect.any(String),
      true
    );
  });
});
