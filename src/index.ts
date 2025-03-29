#!/usr/bin/env node

import { Command } from 'commander';
import { init } from './commands/init';
import { validate } from './commands/validate';
import { fix } from './commands/fix';
import chalk from 'chalk';

const program = new Command();

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
        console.error(chalk.red('Error:'), error.message);
      } else {
        console.error(chalk.red('Error:'), 'An unknown error occurred');
      }
      throw error;
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
        console.error(chalk.red('Error:'), error.message);
      } else {
        console.error(chalk.red('Error:'), 'An unknown error occurred');
      }
      throw error;
    }
  });

program
  .command('fix')
  .description('Fix environment variables based on .env.example')
  .option('-f, --file <path>', 'Path to .env file', '.env')
  .option('-e, --example <path>', 'Path to .env.example file', '.env.example')
  .option(
    '-i, --interactive',
    'Enable interactive mode for fixing variables',
    true
  )
  .action(async options => {
    try {
      await fix(options);
    } catch (error) {
      if (error instanceof Error) {
        console.error(chalk.red('Error:'), error.message);
      } else {
        console.error(chalk.red('Error:'), 'An unknown error occurred');
      }
      throw error;
    }
  });

program.parse();
