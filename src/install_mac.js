import tools from './tools';

export default () => {
    return tools.macCheckXcodeInstalled().then((installed) => {
        if (installed) {
            console.log('--- XCode already installed!');
            return Promise.resolve(true);
        } else {
            console.log('--- Installing XCode');
            returntools.sudo("xcode-select --install", {name: 'Install XCode'});
        }
    }).then(() => {});
}
