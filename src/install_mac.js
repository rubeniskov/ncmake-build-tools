import tools from './tools';

export default (options) => {
    return tools.macCheckXcodeInstalled().then((installed) => {
        if (!options.force && installed) {
            console.log('--- XCode already installed!');
            return Promise.resolve(true);
        } else {
            console.log('--- Installing XCode');
            return tools
                  .exec(
                  `xcode-select --install`, {
                      ...options,
                      name: 'Install XCode',
                      sudo: true
                  })
        }
    }).then(() => {});
}
