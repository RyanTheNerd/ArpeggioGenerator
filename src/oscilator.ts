class Oscillator {
   constructor(ctx) {
      this.ctx = ctx;
      this.gain = this.ctx.createGain();
      this.oscil = this.ctx.createOscillator(this.gain);
      this.oscil.connect(this.gain);
      this.gain.connect(this.ctx.destination);
      
      this.setGain(10);
      
      this.oscil.start();
   }
   stop() {
      this.oscil.stop();
   }
   setFreq(freq: number) {
      this.oscil.frequency.setValueAtTime(freq, this.ctx.currentTime);
   }
   setGain(percent: number) {
      this.gain.gain.setValueAtTime(percent/100, this.ctx.currentTime);
   }
}