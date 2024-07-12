import { default as cliColor } from 'cli-color';
import { spawnSync } from 'node:child_process';
import { join } from 'path';

export const log = (message?: string, newline = true) => process.stdout.write(`${(message ?? '')}${newline ? '\n' : ''}`);
export const listItem = (item: string) => log(` - ${item}`);
export const ln = () => log('');
export const success = (message?: string, newline = true) => {
    log(`  ${cliColor.greenBright(`✔`)} ${message ?? ''}`, newline);
}
export const error = (message?: string, newline = true) => log(`  ${cliColor.red(`✖`)} ${message ?? ''}`, newline);
export const warn = (message?: string, newline = true) => log(`  ${cliColor.yellow(`!`)} ${message ?? ''}`, newline);
export const abort = (message: string, newline = true) => {
    error(message, newline);
    process.exit(1);
}

export const rollbackLine = () => {
    process?.stdout?.clearLine(0);
    process?.stdout?.cursorTo(0);
}

export interface Options {
    openapi: string;
    output: string;
};

export interface InferredOptions extends Options {
    paths: {
        main: string;
        barrel: string;
        barrelDeclarations: string;
        models: string;
        schemas: string;
        tmp: string;
        validators: string;
        dist: string;
    };
}

export const parseOptions = (input: Options): InferredOptions => ({
    ...input,
    paths: {
        main: input.output,
        barrel: join(process.cwd(), input.output, 'index.ts'),
        barrelDeclarations: join(process.cwd(), input.output, 'index.d.ts'),
        models: join(process.cwd(), input.output, 'models'),
        schemas: join(process.cwd(), input.output, 'schemas'),
        validators: join(process.cwd(), input.output, 'validators'),
        dist: join(process.cwd(), input.output, 'dist'),
        tmp: join(process.cwd(), input.output, 'tmp')
    }
});

export const defaultEncoding = { encoding: 'utf-8' as BufferEncoding };

export class SafetyNetBuildException extends Error {
    constructor(msg?: string, private innerError?: Error | unknown) {
        super(
            [
                msg,
                ((innerError ?? {}) as unknown as Error)['message'] ?? undefined
            ].filter(isValid => isValid).join(' - ')
        );
    }
}

export const exec = async (cmd: string, ...args: string[]): Promise<[boolean, string, string]> => {
    const result = spawnSync(cmd, args, {});
    return [
        result.status == 0 && result.error == undefined,
        result.stdout.toString(),
        result.stderr.toString()
    ];
}

export const npxPackageAvailable = async (packageName: string) => {
    // Try local package search first
    let [success, stdout, stderr] = (await exec(`npm`, 'ls', packageName, '--depth=0'));
    if (!success) {
        // Try global packages next
        [success, stdout, stderr] = (await exec(`npm`, 'ls', packageName, '--global'));
    }
    return success;
}
