// Mock process.exit to prevent Jest from actually exiting
const mockExit = jest.spyOn(process, 'exit').mockImplementation(code => {
  throw new Error(`Process.exit(${code})`);
});

// Restore the original implementation after tests
afterAll(() => {
  mockExit.mockRestore();
});

// Silence console output during tests
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
};

// Add type definitions for Jest
export {};

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeValidEnvVar(): R;
    }
  }
}
