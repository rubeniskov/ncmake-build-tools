import tools from './tools';

export default (options) => {
    return tools.linuxCheckBuildEssentialInstalled().then((installed) => {
        if (!options.force && installed) {
            console.log('--- Build Essential already installed!');
            return Promise.resolve(true);
        } else {
            console.log('--- Installing Build Essential');
            return tools
                  .exec(
                  `apt-get update -y && apt-get install ${options.force ? '--reinstall' : ''} build-essential -y`, {
                      ...options,
                      sudo: process.getuid() !== 0
                  });
        }
    }).then(()=>(true))
}
