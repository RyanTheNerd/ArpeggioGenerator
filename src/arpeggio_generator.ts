import {CHORDS} from './note_data';
import Arpeggio from './arpeggio';

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
      let arpeggio = new Arpeggio(this.ctx, notes, noteContext);
      this.arpeggios.push(arpeggio);
      return arpeggio;
   }
   patternFromChord(chordName) {
      let chord = CHORDS[chordName];
      return chord.map((halfSteps) => {
         return {halfSteps: halfSteps}
      });
   }
   stop() {
      this.arpeggios.forEach((a) => a.stop());
   }
}