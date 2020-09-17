import ArpeggioGenerator from './arpeggio_generator';
import * as mod from './pattern';

(document.querySelector("#start") as HTMLElement).onclick = () => {
   let arpeggioGenerator = new ArpeggioGenerator();
   
   let arpeggio = arpeggioGenerator.addArpeggio(arpeggioGenerator.patternFromChord("Major 7th"), {
      rootFreq: 60,
      wholeNoteLength: 0.05
   });
   let pattern = arpeggio.pattern;
   mod.swapEveryOther(mod.everyNthNote(mod.appendOctaves(pattern, 3), mod.changeOctave, 2, [-1]));
   arpeggio.start();
   // let arpeggio = arpeggioGenerator.addArpeggio([
      // {note: 'C', octave: 1},
      // {note: 'E'},
      // {note: 'G', octave: -1},
   // ], {
      // direction: "alternate",
      // wholeNoteLength: 0.5,
      // octaves: 4,
      // octave: -2,
      // rootFreq: 440
   // });
}