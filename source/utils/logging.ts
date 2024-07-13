import { default as cliColor } from 'cli-color';
export const log = (message?: string, newline = true) =>
  process.stdout.write(`${message ?? ''}${newline ? '\n' : ''}`);

export const listItem = (item: string) => log(` - ${item}`);
export const ln = () => log('');

export const success = (message?: string, newline = true) => {
  log(`  ${cliColor.greenBright(`✔`)} ${message ?? ''}`, newline);
};

export const error = (message?: string, newline = true) =>
  log(`  ${cliColor.red(`✖`)} ${message ?? ''}`, newline);
export const warn = (message?: string, newline = true) =>
  log(`  ${cliColor.yellow(`!`)} ${message ?? ''}`, newline);

export const abort = (message: string, newline = true) => {
  error(message, newline);
  process.exit(1);
};

export const rollbackLine = () => {
  process?.stdout?.clearLine(0);
  process?.stdout?.cursorTo(0);
};
