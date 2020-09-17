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
   constructor(ctx: AudioContext, pattern: Array<NoteConfig>, noteContext: NoteContext) {
      this.ctx = ctx;
      this.pattern = pattern;
      this.oscil = new Oscillator(ctx);
      this.currentNote = 0;
      this.direction = "normal";
      this.currentDirection= "accending";
      this.noteContext = noteContext;
      this.noteGenerator = new NoteGenerator(this.noteContext);
   }
   playNextNote(startTime: number = 0) {
      let note = this.noteGenerator.compile(this.pattern[this.currentNote]);
      this.oscil.setFreq(note.freq, startTime);
      let time = this.ctx.currentTime;
      window.setTimeout(() => {
         this.playNextNote(time + note.length); 
      }, (note.length) * 1000);
      this.currentNote++;
      this.currentNote %= this.pattern.length;
   }
   start() {
      this.oscil.start();
      this.playNextNote();
   }
   stop() {
      this.oscil.stop();
   }
}