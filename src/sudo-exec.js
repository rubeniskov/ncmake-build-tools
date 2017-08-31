import {ChildProcess} from 'child_process';
import stream from 'stream';
import sudo from 'sudo-prompt';

export class SudoChildProcess extends ChildProcess {
    constructor(cmd, options) {
        super();
        this.stdout = new stream.PassThrough();
        this.stderr = new stream.PassThrough();

        sudo.exec(cmd, {name: 'Superuser execution', ...options}, (err, stdout, stderr) => {
            if (err) {
                this.emit('error', err);
            }
            if (stdout) {
                this.stdout.end(stdout);
            }
            if (stderr) {
                this.stderr.end(stdout);
            }
            process.nextTick(() => {
                this.emit('close', err ? 127 : 0);
            });
        });
    }
}

export default (cmd, options) => (new SudoChildProcess(cmd, options));
