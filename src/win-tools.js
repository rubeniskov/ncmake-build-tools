import childProcess from 'child_process';
import path from 'path';
import fs from 'fs-extra';
import tools from './tools';

const winTools = {
    ...tools,
    winCheckNetFrameworkVersionInstalled: version => {
        return winTools.winGetNetFrameworkVersions().then(versions => {
            return Boolean((versions || []).filter(ver => {
                return new RegExp(`^${version}`).test(ver);
            }).length);
        });
    },
    winGetNetFrameworkVersions: () => {
        return new Promise((resolve, reject) => {
            childProcess.exec('wmic /namespace:\\\\root\\cimv2 path win32_product where "name like \'%%.NET%%\'" get version', (error, stdout) => {
                if (error) {
                    return reject(error);
                }
                resolve(stdout.match(/\d+(\.\d+)+/igm));
            });
        });
    },
    winCheckVSToolsInstalled: version => {
        return fs.exists(path.join(process.env.ProgramFiles, 'MSBuild', version, 'bin', 'msbuild.exe'));
    }
};

export default winTools;
