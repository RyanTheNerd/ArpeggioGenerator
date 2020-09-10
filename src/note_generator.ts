class NoteGenerator {
   constructor(noteConfig) {
      this.noteConfig = noteConfig;
   }
   compile(note) {
      let length: number;
      if('length' in note) length = note.length * this.noteConfig.wholeNoteLength;
      else length = this.noteConfig.wholeNoteLength;
      
      let freq: number;
      if('freq' in note) {
         freq = note.freq;
      }
      else {
         let octave = 'octave' in note ? note.octave : 0;
         octave += this.noteConfig.octave;
         let halfSteps: number;
         if('note' in note) {
            halfSteps = this.noteToHalfSteps(note.note);
         }
         else if('halfSteps' in note) {
            halfSteps = note.halfSteps;
         }
         else halfSteps = 0;
         freq = this.halfStepsToFreq(halfSteps, octave);
      }
      return {
         freq: freq,
         length: length,
      }
   }
   noteToHalfSteps(noteName) {
      return NOTES.reduce((acc, noteNames, halfSteps) => {
         if(noteNames.includes(noteName)) {
            return halfSteps;
         } 
         else return acc;
      }, null);
   }
   halfStepsToFreq(halfSteps, octave) {
      return Math.pow(2, (halfSteps + (octave * 12))/12) * this.noteConfig.rootFreq;
   }
}