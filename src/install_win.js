import tools from './tools';

export default() => {
    return tools.waterfall([
        () => {
            return tools.winCheckNetFrameworkVersionInstalled('4.6').then((installed) => {
                if (installed) {
                    console.log('--- Net Framework 4.6 already installed!');
                    return Promise.resolve(true);
                } else {
                    console.log('--- Downloading Net Framework 4.6');
                    return tools.download('https://download.microsoft.com/download/E/4/1/E4173890-A24A-4936-9FC9-AF930FE3FA40/NDP461-KB3102436-x86-x64-AllOS-ENU.exe', tools.tmpDir(), 'net_installer.exe').then((filepath) => {
                        console.log(`--- Installing ${filepath}`)
                        return tools.sudo(`powershell -ExecutionPolicy Bypass -NoLogo -NonInteractive -NoProfile -WindowStyle Hidden -Command "& {&Start-Process -FilePath '${filepath}' -ArgumentList '/passive' -Wait}"`, {name: 'Install Net Framework'}).catch((err) => {
                            return tools.sudo(`${filepath} /passive`, {name: 'Install Net Framework'});
                        });
                    });
                }
            });
        },
        () => {
            return tools.winCheckVSToolsInstalled('14.0').then((installed) => {
                if (installed) {
                    console.log('--- Visual CPP Build Tools already installed!');
                    return Promise.resolve(true);
                } else {
                    tools.download('https://download.microsoft.com/download/5/f/7/5f7acaeb-8363-451f-9425-68a90f98b238/visualcppbuildtools_full.exe', tools.tmpDir(), 'visualcppbuildtools.exe').then((filepath) => {
                        console.log(`--- Installing ${filepath}`)
                        return tools.sudo(`powershell -ExecutionPolicy Bypass -NoLogo -NonInteractive -NoProfile -WindowStyle Hidden -Command "& {&Start-Process -FilePath '${filepath}' -ArgumentList '/passive' -Wait}"`, {name: 'Install Visual CPP Build Tools'}).catch((err) => {
                            return tools.sudo(`${filepath} /passive`, {name: 'Install Net Framework'});
                        });;
                    });
                }
            })
        }
    ]);
}
