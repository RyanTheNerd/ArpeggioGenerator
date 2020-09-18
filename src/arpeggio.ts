import Oscillator from './oscillator';
import NoteGenerator from './note_generator';

export default class Arpeggio {
    ctx: AudioContext;
    pattern: Array<NoteConfig>;
    oscil: Oscillator;
    currentNote: number;
    direction: "normal" | "reverse" | "alternate" | "random";
    currentDirection: "accending" | "decending";
    noteContext: NoteContext;
    noteGenerator: NoteGenerator;
    startOffset: number;
   constructor(ctx: AudioContext, pattern: Array<NoteConfig>, noteContext: NoteContext) {
      this.ctx = ctx;
      this.pattern = pattern;
      this.oscil = new Oscillator(ctx);
      this.currentNote = 0;
      this.direction = "normal";
      this.currentDirection= "accending";
      this.noteContext = noteContext;
      this.noteGenerator = new NoteGenerator(this.noteContext);
      this.startOffset = 0;
   }
   playNextNote(startTime: number = null) {
      if(startTime === null) startTime = this.ctx.currentTime;
      let note = this.noteGenerator.compile(this.pattern[this.currentNote]);
      this.oscil.setFreq(note.freq, startTime);
      this.currentNote++;
      this.currentNote %= this.pattern.length;
      let nextTime = startTime + note.length;
      window.setTimeout((nt) => {
         this.playNextNote(nt); 
      }, (note.length * 1000) - 100, nextTime); //((note.length) * 1000));
   }
   start() {
      this.oscil.start();
      this.playNextNote(this.ctx.currentTime + this.startOffset);
   }
   stop() {
      this.oscil.stop();
   }
   clone() {
      return new Arpeggio(this.ctx, this.pattern.slice(), Object.assign({}, this.noteContext));
   }
}