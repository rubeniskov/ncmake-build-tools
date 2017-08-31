/* eslint handle-callback-err: "error" */
/* eslint no-unused-vars: "error" */
import winTools from './win-tools';

export default options => {
    return winTools.waterfall([
        () => {
            return winTools.winCheckNetFrameworkVersionInstalled('4.6').then(installed => {
                if (!options.force && installed) {
                    console.log('--- Net Framework 4.6 already installed!');
                    return Promise.resolve(true);
                }
                console.log('--- Downloading Net Framework 4.6');
                return winTools.download('https://download.microsoft.com/download/E/4/1/E4173890-A24A-4936-9FC9-AF930FE3FA40/NDP461-KB3102436-x86-x64-AllOS-ENU.exe', winTools.tmpDir(), 'net_installer.exe', options).then(filepath => {
                    console.log(`--- Installing ${filepath}`);
                    return winTools.exec(`powershell -ExecutionPolicy Bypass -NoLogo -NonInteractive -NoProfile -WindowStyle Hidden -Command "& {&Start-Process -FilePath '${filepath}' -ArgumentList '/passive' -Wait}"`, {
                        ...options,
                        name: 'Install Net Framework',
                        sudo: true
                    })
                    .catch(err => {
                        console.log(`Getting error ${err}, retry execution`);
                        return winTools.exec(`${filepath} /passive`, {
                            ...options,
                            name: 'Install Net Framework',
                            sudo: true
                        });
                    });
                });
            });
        },
        () => {
            return winTools.winCheckVSToolsInstalled('14.0').then(installed => {
                if (!options.force && installed) {
                    console.log('--- Visual CPP Build Tools already installed!');
                    return Promise.resolve(true);
                }
                return winTools.download('https://download.microsoft.com/download/5/f/7/5f7acaeb-8363-451f-9425-68a90f98b238/visualcppbuildtools_full.exe', winTools.tmpDir(), 'visualcppbuildwinTools.exe', options).then(filepath => {
                    console.log(`--- Installing ${filepath}`);
                    return winTools.exec(`powershell -ExecutionPolicy Bypass -NoLogo -NonInteractive -NoProfile -WindowStyle Hidden -Command "& {&Start-Process -FilePath '${filepath}' -ArgumentList '/passive' -Wait}"`, {
                        ...options,
                        name: 'Install Visual CPP Build Tools',
                        sudo: true
                    })
                    .catch(err => {
                        console.log(`Getting error ${err}, retry execution`);
                        return winTools.exec(`${filepath} /passive`, {
                            ...options,
                            name: 'Install Net Framework',
                            sudo: true
                        });
                    });
                });
            });
        }
    ]);
};
