import yargs from 'yargs';
import install from './install'

export default(options) => {
    const argv = yargs
    .usage('$0 <cmd> [args]')
    .command('install [name]', 'welcome ter yargs!', {
        force: {
            alias: 'f',
            type: 'boolean',
            describe: 'force install even if package are installed'
        }
    })
    .help().argv;

    switch (argv._[0]) {
      case 'install':
          install(argv);
        break;
      case 'uninstall':
          // install(argv);
        break;
      default:
    }
}
