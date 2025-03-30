#!/usr/bin/env node

import { program } from 'commander';
import { init } from '../commands/init';
import { validate } from '../commands/validate';
import { fix } from '../commands/fix';

program
  .name('envcheck')
  .description('A CLI tool to validate environment variables')
  .version('1.0.0');

program
  .command('init')
  .description('Initialize a new .env.example file')
  .action(init);

program
  .command('validate')
  .description('Validate environment variables against .env.example')
  .action(validate);

program
  .command('fix')
  .description('Fix environment variables based on .env.example')
  .option('-y, --yes', 'Skip confirmation prompts', false)
  .option('-f, --force', 'Force overwrite existing values', false)
  .option('-p, --path <path>', 'Path to the .env file', '.env')
  .option('-e, --example <path>', 'Path to the .env.example file')
  .action(options => {
    fix({
      file: options.path,
      example: options.example || '.env.example',
      interactive: !options.yes,
      force: options.force,
    });
  });

program.parse();
