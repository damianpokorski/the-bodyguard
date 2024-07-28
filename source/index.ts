import { Options } from '@utils/parseOptions';
import { Command } from 'commander';
import { main } from './main';
export * from './main';

new Command('the-bodyguard')
  .requiredOption('--openapi <string>', 'Path to the OpenAPI specification')
  .requiredOption('--output <string>', 'Output path')
  .option(`--force`, 'Force generation is checksums match', false)
  .action(async (cmd: Options) => {
    try {
      await main(cmd);
    } catch (e) {
      console.log('Failed generation');
      console.log(e);
    }
  })
  .parse();
