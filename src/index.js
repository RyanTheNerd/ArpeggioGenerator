
/*
What arpeggio generator should do:
   Be able to generate an arpeggio of any type in any key
   Play multiple arpeggios at once
   Play arpeggios in different rhythms and speeds
   Create new arpeggios using onscreen display
   Start and stop arpeggios
Class ArpeggioBase {
   constructor(gain, root, chord, rhythm, speed)
   public methods:
      start
      setRoot(note, octave)
      setChord(key)
      setRhythm([{status: on/off, length: factor * tempo, noteIndex: key}])
      setTempo(length in miliseconds)
      setVolume(between 0-100)
      pause()
      stop()
      
   members:
      gain
      oscil
      ctx
      root
      chord
}

Note attributes:
   tambre,
   length,
   pitch,
   root,
   amplitude,

Extra attributes:
   articulation
   
*/

const CHORDS = {
    "Major Triad": [1, 5, 8],
    "Minor Triad": [1, 4, 8],
    "7th": [1, 5, 8, 11],
    "Major 7th": [1, 5, 8, 12],
    "Minor 7th": [1, 4, 8, 11],
    "6th": [1, 5, 6, 8],
    "9th": [1, 2, 5, 8, 11],
    "Major 9th": [1, 3, 5, 8, 12],
    "Add 9": [1, 5, 8, 9],
    "Sus 4": [1, 5, 6, 8],
    "Dim": [1, 4, 7],
    "Dim 7": [1, 4, 7, 10],
    "Augmented 5th": [1, 5, 9],
    "Custom": [1, 5, 8],
};

const WAVEFORMS = ["sine", "square", "triangle", "sawtooth"];
const NOTES = [
   ['A'],
   ['A#', 'Bb'],
   ['B'],
   ['B#', 'C'],
   ['C#', 'Db'],
   ['D'],
   ['D#', 'Eb'],
   ['E', 'Fb'],
   ['E#', 'F'],
   ['F#', 'Gb'],
   ['G'],
   ['G#', 'Ab']
];

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

class Arpeggio {
   constructor(ctx, pattern, noteConfig) {
      this.ctx = ctx;
      this.pattern = pattern;
      this.oscil = new Oscillator(ctx);
      this.currentNote = 0;
      this.direction = "normal";
      this.alternateDirection = "accending";
      
      this.noteConfig = noteConfig;
      this.noteGenerator = new NoteGenerator(this.noteConfig);
      
      this.playNextNote();
   }
   playNextNote(startTime = null) {
      if(startTime == null) startTime = this.ctx.currentTime;
      
      this.determineNextNote();
      let note = this.noteGenerator.compile(this.pattern[this.currentNote]);
      this.oscil.setFreq(note.freq, startTime);
      let nextTime = this.ctx.currentTime + note.length;
      window.setTimeout(() => {
         this.playNextNote(nextTime); 
      }, (note.length) * 1000 - 100);
   }
   determineNextNote() {
      if(this.direction == "normal") {
         this.currentNote += 1;
         this.currentNote %= this.pattern.length;
      }
      else if(this.direction == "reverse") {
         this.currentNote -= 1;
         if(this.currentNote < 0) this.currentNote = this.pattern.length - 1;
      }
      else if(this.direction == "alternate") {
         if(this.currentNote > this.pattern.length) {
            this.alternateDirection = -1;
         }
         else if(this.currentNote < 0) {
            this.alternateDirection = 1;
         }
         this.currentNote += this.alternateDirection;
      }
      else if(this.direction == "random") {
         let prevNote = this.currentNote;
         while(this.currentNote == prevNote && this.pattern.length > 1) {
            this.currentNote = Math.floor(Math.random() * this.pattern.length);
         }
      }
      else {
         console.error("Invalid direction");
      }
   }
   stop() {
      this.oscil.stop();
   }
}

class ArpeggioGenerator {
   constructor() {
      this.ctx = new AudioContext();
      this.wholeNoteLength = 1;
      this.arpeggios = [];
      document.querySelector('#stop').onclick = () => {
         this.stop();
      };
   }
   addArpeggio(pattern, noteConfig) {
      let fullPattern = [];
      for(let octave = 0; octave < noteConfig.octaves; octave++) {
         pattern.forEach((note) => {
            let newNote = Object.assign({}, note);
            newNote.octave = octave;
            if('octave' in note) newNote.octave += note.octave;
            fullPattern.push(newNote); 
         });
      }
      console.log(fullPattern);
      let arpeggio = new Arpeggio(this.ctx, fullPattern, noteConfig);
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


document.querySelector("#start").onclick = () => {
   let arpeggioGenerator = new ArpeggioGenerator();
   
   let arpeggio = arpeggioGenerator.addArpeggio([
      {note: 'C', octave: 1},
      {note: 'E'},
      {note: 'G', octave: -1},
   ], {
      direction: "alternate",
      wholeNoteLength: 0.5,
      octaves: 4,
      octave: -2,
      rootFreq: 440
   });
}