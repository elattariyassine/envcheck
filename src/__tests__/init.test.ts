import { init } from '../commands/init';
import fs from 'fs';
import inquirer from 'inquirer';

// Mock the fs module
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  writeFileSync: jest.fn(),
}));

// Mock the inquirer module
jest.mock('inquirer', () => ({
  prompt: jest.fn(),
}));

// Mock console.log
const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

describe('init command', () => {
  const mockedFs = jest.mocked(fs);
  const mockedInquirer = jest.mocked(inquirer);

  beforeEach(() => {
    jest.clearAllMocks();
    consoleSpy.mockClear();
  });

  afterAll(() => {
    consoleSpy.mockRestore();
  });

  it('should not create file if .env.example already exists', async () => {
    // Mock fs.existsSync to return true
    mockedFs.existsSync.mockReturnValue(true);

    // Run the init command
    await init();

    // Verify that we logged the message
    expect(consoleSpy).toHaveBeenCalledWith('env already exists');
    // Verify that we didn't prompt the user
    expect(mockedInquirer.prompt).not.toHaveBeenCalled();
    // Verify that we didn't try to write the file
    expect(mockedFs.writeFileSync).not.toHaveBeenCalled();
  });

  it('should not create file if user chooses not to', async () => {
    // Mock fs.existsSync to return false
    mockedFs.existsSync.mockReturnValue(false);
    // Mock inquirer.prompt to return false
    mockedInquirer.prompt.mockResolvedValue({ createExample: false });

    // Run the init command
    await init();

    // Verify that we prompted the user
    expect(mockedInquirer.prompt).toHaveBeenCalledWith([
      {
        type: 'confirm',
        name: 'createExample',
        message: 'Do you want to create a new .env.example file?',
        default: true,
      },
    ]);
    // Verify that we didn't try to write the file
    expect(mockedFs.writeFileSync).not.toHaveBeenCalled();
  });

  it('should create file with correct content if user chooses to', async () => {
    // Mock fs.existsSync to return false
    mockedFs.existsSync.mockReturnValue(false);
    // Mock inquirer.prompt to return true
    mockedInquirer.prompt.mockResolvedValue({ createExample: true });

    // Run the init command
    await init();

    // Verify that we prompted the user
    expect(mockedInquirer.prompt).toHaveBeenCalledWith([
      {
        type: 'confirm',
        name: 'createExample',
        message: 'Do you want to create a new .env.example file?',
        default: true,
      },
    ]);
    // Verify that we wrote the file with the correct content
    expect(mockedFs.writeFileSync).toHaveBeenCalledWith(
      '.env.example',
      expect.stringContaining('# Database Configuration')
    );
    expect(mockedFs.writeFileSync).toHaveBeenCalledWith(
      '.env.example',
      expect.stringContaining('DB_HOST=localhost')
    );
    expect(mockedFs.writeFileSync).toHaveBeenCalledWith(
      '.env.example',
      expect.stringContaining('# API Configuration')
    );
    expect(mockedFs.writeFileSync).toHaveBeenCalledWith(
      '.env.example',
      expect.stringContaining('API_URL=http://localhost:3000')
    );
    // Verify that we logged the success message
    expect(consoleSpy).toHaveBeenCalledWith(
      'Created .env.example file successfully'
    );
  });

  it('should handle errors when writing the file', async () => {
    // Mock fs.existsSync to return false
    mockedFs.existsSync.mockReturnValue(false);
    // Mock inquirer.prompt to return true
    mockedInquirer.prompt.mockResolvedValue({ createExample: true });
    // Mock fs.writeFileSync to throw an error
    mockedFs.writeFileSync.mockImplementation(() => {
      throw new Error('Write failed');
    });

    // Run the init command and expect it to throw
    await expect(init()).rejects.toThrow('Write failed');
  });
});
