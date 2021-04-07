#!/usr/bin/env node

import path from 'path';
import { promises } from 'fs';
import commander from 'commander';

const { readFile } = promises;

(async () => {
    let { program } = commander;
    let packageJson = new URL('./package.json', import.meta.url);
    let json = JSON.parse(await readFile(packageJson, 'utf-8'));

    program
        .version(json.version);

    program
        .command('build <entry>', { isDefault: true })
        .description('Compile JS and CSS modules using esbuild (https://esbuild.github.io/). It can output multiple module formats and it can be used to build a single module or to bundle all dependencies of an application.')
        .option('-O, --output <path>', 'output directory or file')
        .option('-F, --format <type>', 'bundle format')
        .option('-B, --bundle', 'bundle dependencies')
        .option('-M, --minify', 'minify the build')
        .action(async (input, { output, format = 'esm', bundle, minify, name }) => {
            const { build } = await import('./lib/index.js');

            await build({
                input: path.resolve(input),
                output: path.resolve(output),
                format,
                name,
                bundle,
                minify,
                sourcemap: true,
            });
        });

    program
        .command('serve [root]')
        .description('Start a web dev server (https://modern-web.dev/docs/dev-server/overview/) that transforms ESM imports for node resolution on demand. It also uses esbuild (https://esbuild.github.io/) to compile non standard JavaScript syntax.')
        .option('-P, --port <number>', 'server port number')
        .action(async (root, { port, index }) => {
            const { serve } = await import('./lib/index.js');

            await serve({
                port: port ? parseInt(port) : undefined,
            });
        });

    program
        .command('test [specs]')
        .description('Start a browser test runner (https://modern-web.dev/docs/test-runner/overview/) based on the web dev server. It uses mocha (https://mochajs.org/) but you still need to import an assertion library (recommended https://open-wc.org/docs/testing/testing-package/).')
        .option('-W, --watch', 'watch test files')
        .option('-C, --coverage', 'add coverage to tests')
        .option('-O, --open', 'open the browser')
        .action(async (specs, { watch, coverage, open }) => {
            const { test } = await import('./lib/index.js');

            /**
             * @type {Partial<import('@web/test-runner').TestRunnerConfig>}
             */
            let config = {
                watch,
                coverage,
                open,
                manual: open ? true : undefined,
            };
            if (specs) {
                config.files = specs.split(' ');
            }
            await test(config);
        });

    program
        .parse(process.argv);

})();