import nugget from 'nugget';
import path from 'path';
import fs from 'fs-extra';
import os from 'os';
import childProcess from 'child_process';
import sudo from 'sudo-prompt';
import waterfall from 'promise-waterfall';

const tools = {
    waterfall: waterfall,
    sudo: (cmd, options) => {
        return new Promise((resolve, reject) => {
            sudo.exec(cmd, {name: "Super user execution", ...options}, (err, stdout, stderr) => {
                if(err)
                    return reject(err);
                resolve(stdout, stderr);
            });
        });
    },
    tmpDir: (...args) => {
        return path.join(...[os.tmpDir(), ...args]);
    },
    exec: (cmd, args, options) => {
        if (args && args.length === undefined) {
            options = args;
            args = [];
        }

        options = {
            stdio: [
                null, 'stdout'
            ],
            ...options
        }

        return new Promise((resolve, reject) => {
            let proc;
            if (options.sudo) {
                if ((/^win/).test(process.platform)) {
                    proc = childProcess.execFile(path.join(__dirname, '..', 'scripts', 'sudo.bat'), [cmd].concat(args), options);
                    proc = childProcess.execFile(cmd, args, options);
                }
            } else {
                proc = childProcess.exec(cmd, args, options);
            }
            proc.stdout.on('data', (data) => {
                console.log(data);
            });
            proc.on('close', (code) => {
                return code !== 0
                    ? reject(new Error(`Failed execution of ${cmd} with exit code ${code}`))
                    : resolve(proc);
            }).on('error', (err) => {
                return reject(err);
            });
        })
    },
    winCheckNetFrameworkVersionInstalled: (version) => {
      return tools.winGetNetFrameworkVersions().then((versions) => {
          return !!(versions||[]).filter((version) => {
              return new RegExp(`^${version}`).test(version);
          }).length;
      });
    },
    winGetNetFrameworkVersions: () => {
        return new Promise((resolve, reject) => {
            childProcess.exec('wmic /namespace:\\\\root\\cimv2 path win32_product where "name like \'%%.NET%%\'" get version', (error, stdout, stderr) => {
                if (error)
                    return reject(error);
                resolve(stdout.match(/\d+(\.\d+)+/igm))
            });
        });
    },
    winCheckVSToolsInstalled: (version) => {
        return fs.exists(path.join(process.env.ProgramFiles, 'MSBuild', version, 'bin', 'msbuild.exe'));
    },
    macCheckXcodeInstalled: () => {
        return new Promise((resolve, reject) => {
            childProcess.exec('xcode-select -p', (error, stdout, stderr) => {
                if (error)
                    return reject(error);
                resolve((/Xcode\.app/).test(stdout))
            });
        });
    },
    linuxCheckBuildEssentialInstalled: () => {
        return new Promise((resolve, reject) => {
            childProcess.exec('dpkg --get-selections | grep build-essential', (error, stdout, stderr) => {
                // if (error)
                //     return reject(error);
                resolve(!!stdout.length)
            });
        });
    },
    download: (url, dir, filename) => {
        return new Promise((resolve, reject) => {
            const filepath = path.join(dir, filename),
                nuggetOptions = {
                    target: filename,
                    dir: dir,
                    resume: process.env.npm_config_resume || true,
                    verbose: true,
                    strictSSL: process.env.npm_config_strict_ssl || false,
                    proxy: process.env.npm_config_proxy || process.env.PROXY || undefined,
                    sockets: process.env.npm_config_sockets || undefined
                }

            nugget(url, nuggetOptions, (errors) => {
                if (errors) {
                    const error = errors[0]

                    if (error.message.indexOf('404') === -1) {
                        return reject(error)
                    } else {
                        return reject(new Error(`Could not find ${filepath} at ${url}`))
                    }
                }
                resolve(filepath);
            })
        })
    }
}

export default tools;
