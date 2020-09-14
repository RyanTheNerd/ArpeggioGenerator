import ArpeggioGenerator from './arpeggio_generator';

(document.querySelector("#start") as HTMLElement).onclick = () => {
   let arpeggioGenerator = new ArpeggioGenerator();
   
   let arpeggio = arpeggioGenerator.addArpeggio(arpeggioGenerator.patternFromChord("Major 7th"), {
      octave: -2,
      rootFreq: 440,
      wholeNoteLength: 0.05
   });
   arpeggio.pattern.appendOctaves(3);
   arpeggio.pattern.appendNotes(arpeggio.pattern.swapEveryOther(arpeggio.pattern.copyNotes()));
   console.log(arpeggio.pattern.notes);
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