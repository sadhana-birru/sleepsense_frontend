/**
 * Utility to encode raw PCM data into WAV format.
 * This is a lightweight implementation to avoid large dependencies.
 */

export function encodeWAV(samples, sampleRate) {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);

    /* RIFF identifier */
    writeString(view, 0, 'RIFF');
    /* file length */
    view.setUint32(4, 36 + samples.length * 2, true);
    /* RIFF type */
    writeString(view, 8, 'WAVE');
    /* format chunk identifier */
    writeString(view, 12, 'fmt ');
    /* format chunk length */
    view.setUint32(16, 16, true);
    /* sample format (raw) */
    view.setUint16(20, 1, true);
    /* channel count */
    view.setUint16(22, 1, true);
    /* sample rate */
    view.setUint32(24, sampleRate, true);
    /* byte rate (sample rate * block align) */
    view.setUint32(28, sampleRate * 2, true);
    /* block align (channel count * bytes per sample) */
    view.setUint16(32, 2, true);
    /* bits per sample */
    view.setUint16(34, 16, true);
    /* data chunk identifier */
    writeString(view, 36, 'data');
    /* data chunk length */
    view.setUint32(40, samples.length * 2, true);

    floatTo16BitPCM(view, 44, samples);

    return new Blob([view], { type: 'audio/wav' });
}

function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
}

function floatTo16BitPCM(output, offset, input) {
    for (let i = 0; i < input.length; i++, offset += 2) {
        let s = Math.max(-1, Math.min(1, input[i]));
        output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
}

/**
 * Helper to record audio and return a WAV blob.
 */
export class AudioRecorder {
    constructor() {
        this.audioContext = null;
        this.stream = null;
        this.input = null;
        this.processor = null;
        this.samples = [];
        this.recording = false;
    }

    async start() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        this.input = this.audioContext.createMediaStreamSource(this.stream);
        
        // Use ScriptProcessorNode (deprecated but widely supported and easier for this task than AudioWorklet)
        this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);
        
        this.samples = [];
        this.recording = true;

        this.processor.onaudioprocess = (e) => {
            if (!this.recording) return;
            const inputData = e.inputBuffer.getChannelData(0);
            this.samples.push(new Float32Array(inputData));
        };

        this.input.connect(this.processor);
        this.processor.connect(this.audioContext.destination);
    }

    stop() {
        this.recording = false;
        
        if (this.processor) {
            this.processor.disconnect();
            this.input.disconnect();
        }
        
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
        }

        if (this.audioContext) {
            this.audioContext.close();
        }

        // Flatten samples
        const totalLength = this.samples.reduce((acc, curr) => acc + curr.length, 0);
        const result = new Float32Array(totalLength);
        let offset = 0;
        for (const sample of this.samples) {
            result.set(sample, offset);
            offset += sample.length;
        }

        return encodeWAV(result, this.audioContext.sampleRate);
    }
}