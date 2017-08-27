import tools from './tools';

export default () => {
    return tools.linuxCheckBuildEssentialInstalled().then((installed) => {
        if (installed) {
            console.log('--- Build Essential already installed!');
            return Promise.resolve(true);
        } else {
            console.log('--- Installing Build Essential');
            // return tools.exec("apt-get install build-essential -y");
            return tools.sudo("sudo -get install build-essential -y", {name: 'Install Build Essential'});
        }
    }).then(() => {});
}
