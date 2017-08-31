import macTools from './mac-tools';

export default options => {
    return macTools.macCheckXcodeInstalled().then(installed => {
        if (!options.force && installed) {
            console.log('--- XCode already installed!');
            return Promise.resolve(true);
        }
        console.log('--- Installing XCode');
        return macTools.exec(`xcode-select --install`, {
            ...options,
            name: 'Install XCode',
            sudo: true
        });
    }).then(() => {});
};
