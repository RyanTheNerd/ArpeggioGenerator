export default class Oscillator {
   ctx: AudioContext;
   gain: GainNode;
   oscil: OscillatorNode;

   constructor(ctx) {
      this.ctx = ctx;
      this.gain = this.ctx.createGain();
      this.oscil = this.ctx.createOscillator();
      this.oscil.connect(this.gain);
      this.oscil.type = "square";
      this.gain.connect(this.ctx.destination);
      
      this.setGain(1);
      
   }
   stop() {
      this.oscil.stop();
   }
   start() {
      this.oscil.start();
   }
   setFreq(freq: number, startTime = 0) {
      this.oscil.frequency.setValueAtTime(freq, this.ctx.currentTime + startTime);
   }
   setGain(percent: number) {
      this.gain.gain.setValueAtTime(percent/100, this.ctx.currentTime);
   }
}