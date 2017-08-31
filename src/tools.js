import path from 'path';
import os from 'os';
import childProcess from 'child_process';
import nugget from 'nugget';
import waterfall from 'promise-waterfall';
import sudoExec from './sudo-exec';

const tools = {
    waterfall,
    tmpDir: (...args) => {
        return path.join(...[
            os.tmpDir(), ...args
        ]);
    },
    environ: (env, cb) => {
        if (typeof env === 'string') {
            return tools.environ({[env]: typeof cb === 'function' ? cb : () => (false)});
        }
        if(typeof env[process.platform] === 'function'){
            return env[process.platform]();
        }

        return null;
    },
    exec: (cmd, options) => {
        options = {
            sudo: false,
            verbose: false,
            ...options
        };

        return new Promise((resolve, reject) => {
            const proc = options.sudo
                ? sudoExec(cmd, options)
                : childProcess.exec(cmd, options);

            if (options.verbose) {
                proc.stdout.on('data', data => {
                    process.stdout.write(data);
                });

                proc.stderr.on('data', data => {
                    process.stderr.write(data);
                });
            }

            proc.on('close', code => {
                return code !== 0
                    ? reject(new Error(`Failed execution of ${cmd} with exit code ${code}`))
                    : resolve(code);
            }).on('error', err => {
                return reject(err);
            });
        });
    },
    download: (url, dir, filename, options) => {
        return new Promise((resolve, reject) => {
            const
                filepath = path.join(dir, filename),
                nuggetOptions = {
                    ...options,
                    target: filename,
                    dir,
                    resume: process.env.npm_config_resume || true,
                    strictSSL: process.env.npm_config_strict_ssl || false,
                    proxy: process.env.npm_config_proxy || process.env.PROXY || undefined,
                    sockets: process.env.npm_config_sockets || undefined
                };

            nugget(url, nuggetOptions, errors => {
                if (errors) {
                    const error = errors[0];

                    if (error.message.indexOf('404') === -1) {
                        return reject(error);
                    }

                    return reject(new Error(`Could not find ${filepath} at ${url}`));
                }
                resolve(filepath);
            });
        });
    }
};

export default tools;
