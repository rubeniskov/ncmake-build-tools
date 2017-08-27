export default () => {
    switch (process.platform) {
        case 'win32':
            console.log('Windows detected');
            return require('./install_win').default();
            break;
        case 'linux':
            console.log('Linux detected');
            return require('./install_linux').default();
            break;
        case 'darwin':
            console.log('MacOS detected');
            return require('./install_mac').default();
            break;
    }
}
