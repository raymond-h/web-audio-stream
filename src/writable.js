import stream from 'stream';

export class WebAudioBufferWritable extends stream.Writable {
    constructor(audioCxt) {
        super({ objectMode: true });

        this.audioCxt = audioCxt;
        this.queue = [];
        this.outNode = null;
        this.playing = false;
    }

    _write(chunk, enc, done) {
        const src = this.audioCxt.createBufferSource();
        src.buffer = chunk;
        src.connect(this.outNode);
        src.onended = () => {
            this.playing = false;
            this._playNextBuffer();
        };

        this.queue.push(src);
        this._playNextBuffer();
        done();
    }

    _playNextBuffer() {
        if(this.playing) return;

        const src = this.queue.shift();
        if(src == null) return;
        src.start();
        this.playing = true;
    }

    connect(node) {
        this.outNode = node;
        this._playNextBuffer();
    }
}
