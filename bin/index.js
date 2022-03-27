#! /usr/bin/env node
const { program } = require('commander');
const { runAction, runActionWithPath } = require('../main');

program
  .name('ZPGRunner')
  .description('CLI to Postgres backup ')
  .version("1.0.0");

program
    .command('p <path>')
    .description('Set specific config path')
    .action(runActionWithPath)

program
    .command('x')
    .description('Execute runner directory')
    // .action(writeSchemas)
    .action(runAction)

program.parse();