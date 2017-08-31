import test from 'ava';
import path from 'path';
import os from 'os';
import tools from '../lib/tools';

test('Check environ function', t => {
    t.plan(2);
    const platforms = {
        'darwin': () => {
            if(process.platform === 'darwin'){
                t.pass();
            }
        },
        'linux': () => {
            if(process.platform === 'linux'){
                t.pass();
            }
        },
        'win32': () => {
            if(process.platform === 'win32'){
                t.pass();
            }
        }
    }

    tools.environ(process.platform, platforms[process.platform]);
    tools.environ(platforms);
});


test('Check tmpDir function', t => {
    t.is(tools.tmpDir(), path.join(os.tmpDir()));
    t.is(tools.tmpDir('foo'), path.join(os.tmpDir(), 'foo'));
    t.is(tools.tmpDir('foo', 'bar'), path.join(os.tmpDir(), 'foo', 'bar'));
});
