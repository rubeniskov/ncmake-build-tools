export default (options) => {
    options = {
      force: false,
      ...options}
    switch (process.platform) {
        case 'win32':
            console.log('Windows detected');
            return require('./install_win')
                .default(options);
            break;
        case 'linux':
            console.log('Linux detected');
            return require('./install_linux')
                .default(options);
            break;
        case 'darwin':
            console.log('MacOS detected');
            return require('./install_mac')
                .default(options);
            break;
    }
}
