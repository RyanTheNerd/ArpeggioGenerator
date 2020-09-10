import ArpeggioGenerator from './arpeggio_generator';

(document.querySelector("#start") as HTMLElement).onclick = () => {
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