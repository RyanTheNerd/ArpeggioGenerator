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
   addArpeggio(pattern, noteContext) {
      let fullPattern = [];
      for(let octave = 0; octave < noteContext.octaves; octave++) {
         pattern.forEach((note) => {
            let newNote = (<any>Object).assign({}, note);
            newNote.octave = octave;
            if('octave' in note) newNote.octave += note.octave;
            fullPattern.push(newNote); 
         });
      }
      let arpeggio = new Arpeggio(this.ctx, fullPattern, noteContext);
      this.arpeggios.push(arpeggio);
      return arpeggio;
   }
   arpeggioFromChord(chordName, config) {
      let chord = CHORDS[chordName];
      let order = config.noteOrder || null;
      let pattern = chord.map((note, index) => {
         if(order) return {halfSteps: chord[order[index] - 1]};
         else return {halfSteps: note};
      });
      let fullPattern = [];
      return this.addArpeggio(fullPattern, config);
   }
   stop() {
      this.arpeggios.forEach((a) => a.stop());
   }
}