import {CHORDS} from './note_data';
import Arpeggio from './arpeggio';
import {fromChord} from './pattern';

export default class ArpeggioGenerator {
    ctx: AudioContext;
    wholeNoteLength: number;
    arpeggios: Array<Arpeggio>;

   constructor() {
      this.ctx = new AudioContext();
      this.wholeNoteLength = 1;
      this.arpeggios = [];
      (document.querySelector('#stop') as HTMLElement).onclick = () => {
         this.stop();
      };
   }
   addArpeggio(notes, noteContext) {
      let pattern = [];
      pattern.push(...notes);
      for(let note of pattern) {
         if(!("octave" in note)) {
            note.octave = 0;
         }
         if(!("length" in note)) {
            note.length = 1;
         }
      }
      let arpeggio = new Arpeggio(this.ctx, pattern, noteContext);
      this.arpeggios.push(arpeggio);
      return arpeggio;
   }
   copyArpeggio(arpeggio) {
      let newArpeggio = arpeggio.clone();
      this.arpeggios.push(newArpeggio);
      return newArpeggio;
   }
   patternFromChord(chordName) {
      let chord = CHORDS[chordName];
      return chord.map((halfSteps) => {
         return {halfSteps: halfSteps}
      });
   }
   start() {
      this.arpeggios.forEach((a) => a.start());
   }
   stop() {
      this.arpeggios.forEach((a) => a.stop());
   }
}