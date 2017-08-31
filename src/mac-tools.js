import childProcess from 'child_process';
import tools from './tools';

const macTools = {
    ...tools,
    macCheckXcodeInstalled: () => {
        return new Promise((resolve, reject) => {
            childProcess.exec('xcode-select -p', (error, stdout) => {
                if (error) {
                    return reject(error);
                }
                resolve((/Xcode\.app/).test(stdout));
            });
        });
    }
};

export default macTools;
