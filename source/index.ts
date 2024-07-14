import { Options } from '@utils/utils';
import { Command } from 'commander';
import { main } from './main';
export * from './main';

new Command('the-bodyguard')
  .requiredOption('--openapi <string>', 'Path to the OpenAPI specification')
  .requiredOption('--output <string>', 'Output path')
  .action(async (cmd: Options) => {
    try {
      await main(cmd);
    } catch (e) {
      console.log('Failed generation');
      console.log(e);
    }
  })
  .parse();
