import childProcess from 'child_process';
import tools from './tools';

const linuxTools = {
    ...tools,
    linuxCheckBuildEssentialInstalled: () => {
        return new Promise((resolve, reject) => {
            childProcess.exec('dpkg --get-selections | grep build-essential', (error, stdout) => {
                if (error) {
                    return reject(error);
                }
                resolve(Boolean(stdout.length));
            });
        });
    }
};

export default linuxTools;
