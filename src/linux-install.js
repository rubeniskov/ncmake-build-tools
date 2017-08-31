import linuxTools from './linux-tools';

export default options => {
    return linuxTools.linuxCheckBuildEssentialInstalled().then(installed => {
        if (!options.force && installed) {
            console.log('--- Build Essential already installed!');
            return Promise.resolve(true);
        }
        console.log('--- Installing Build Essential');
        return linuxTools.exec(`apt-get update -y && apt-get install ${options.force ? '--reinstall' : ''} build-essential -y`, {
            ...options,
            sudo: process.getuid() !== 0
        })
        .then(code => (code === 0));
    });
};
