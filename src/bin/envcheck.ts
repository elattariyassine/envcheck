#!/usr/bin/env node

import { program } from 'commander';
import { init, validate, fix } from '../index';
import chalk from 'chalk';
import { readFileSync } from 'fs';
import { join } from 'path';

// Get version from package.json
const packageJson = JSON.parse(
  readFileSync(join(__dirname, '../../package.json'), 'utf8')
);
const version = packageJson.version;

program
  .name('envcheck')
  .description('A CLI tool to validate environment variables')
  .version(version);

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
  .option('--no-interactive', 'Disable interactive mode for fixing variables')
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
