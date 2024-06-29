import { default as cliColor } from 'cli-color';
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
        barrel: join(input.output, 'index.ts'),
        barrelDeclarations: join(input.output, 'index.d.ts'),
        models: join(input.output, 'models'),
        schemas: join(input.output, 'schemas'),
        validators: join(input.output, 'validators'),
        dist: join(input.output, 'dist'),
        tmp: join(input.output, 'tmp')
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