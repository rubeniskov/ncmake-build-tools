import tools from './tools';

export default options => {
    options = {
        force: false,
        ...options
    };

    return tools.environ({
        win32: () => {
            console.log('Windows detected');
            return require('./win-install').default(options);
        },
        linux: () => {
            console.log('Linux detected');
            return require('./linux-install').default(options);
        },
        darwin: () => {
            console.log('MacOS detected');
            return require('./mac-install').default(options);
        }
    });
};
