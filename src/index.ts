import ArpeggioGenerator from './arpeggio_generator';
import * as mod from './pattern';

(document.querySelector("#start") as HTMLElement).onclick = () => {
   let arpeggioGenerator = new ArpeggioGenerator();
   
   let arpeggio = arpeggioGenerator.addArpeggio(arpeggioGenerator.patternFromChord("Major 7th"), {
      rootFreq: 60,
      wholeNoteLength: 0.25
   });
   let pattern = arpeggio.pattern;
   pattern = mod.appendOctaves(pattern, 3);
   pattern = mod.everyNthNote(pattern, mod.changeOctave, 2, [-1]);
   pattern = mod.swapEveryOther(pattern);
   pattern = mod.mirrorPattern(pattern);

   let arpeggio2 = arpeggioGenerator.copyArpeggio(arpeggio);
   arpeggio2.startOffset = 0.001;

   arpeggioGenerator.start();
}