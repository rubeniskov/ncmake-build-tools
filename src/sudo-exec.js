import {ChildProcess} from 'child_process';
import sudo from 'sudo-prompt';
import util from 'util';
import net from 'net';
import stream from 'stream';

export default class SudoChildProcess extends ChildProcess {
    call constructor(cmd, options){
        return new SudoChildProcess(cmd, options);
    }

    constructor(cmd, options){
        super();
        
        this.stdout = new stream.PassThrough();
        this.stderr = new stream.PassThrough();

        sudo.exec(cmd, {name: "Superuser execution", ...options}, (err, stdout, stderr) => {
            if(err)
                this.emit('error', err);
            stdout && this.stdout.end(stdout);
            stderr && this.stderr.end(stdout);
            process.nextTick(() => {
                this.emit('close', err ? 127 : 0);
            });
        });
    }
}
