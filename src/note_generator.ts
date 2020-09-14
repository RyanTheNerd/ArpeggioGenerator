import {NOTES} from './note_data';
export default class NoteGenerator {
     noteContext: NoteContext;
    constructor(noteContext) {
        this.noteContext = noteContext;
    }
    compile(note) {
        let length: number;
        if('length' in note) length = note.length * this.noteContext.wholeNoteLength;
        else length = this.noteContext.wholeNoteLength;
        
        let freq: number;
        if('freq' in note) {
            freq = note.freq;
        }
        else {
            let octave = 'octave' in note ? note.octave : 0;
            octave += 'octave' in this.noteContext ? this.noteContext.octave : 0;
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
    noteToHalfSteps(noteName: string) {
        for(let i = 0; i < NOTES.length; i++) {
            if(NOTES[i].includes(noteName)) return i;
        }
        console.error(`noteToHalfSteps failed: Invalid note name: ${noteName}`);
    }
    halfStepsToFreq(halfSteps: number, octave: number = 0) {
        return Math.pow(2, (halfSteps + (octave * 12))/12) * this.noteContext.rootFreq;
    }
}