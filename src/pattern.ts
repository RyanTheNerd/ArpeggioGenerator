import {CHORDS} from './note_data';


function fromChord(chordName) {
    return CHORDS[chordName].map((halfSteps) => {
        return {halfSteps: halfSteps}
    });
}

const DEFAULT_NOTE_VALUES = {
    octave: 0, 
    length: 1,
}

export default class Pattern {
    notes: Array<NoteConfig>;
    constructor(notes) {
        this.notes = notes.map((note) => {
            return Object.assign({}, DEFAULT_NOTE_VALUES, note);
        });
    }
    appendNotes(notes) {
        this.notes = [...this.notes, ...notes];
    }
    copyNotes() {
        return [...this.notes];
    }
    mirrorPattern() {
        this.notes = [...this.copyNotes(), ...this.reverseNotes().slice(1, -1)];
    }
    appendOctaves(octaves) {
        for(let octave = 0; octave < octaves; octave++) {
            this.appendNotes(this.changeOctave(this.copyNotes(), octave));
        }

    }
    changeOctave(notes, octave) {
        return notes.map((note) => {
            let newNote = Object.assign({}, note);
            newNote.octave += octave;
            return newNote;
        });
    }
    reverseNotes(notes = this.notes) {
        return [...notes].reverse();
    }
    swapEveryOther(notes = this.notes) {
        let newNotes = [...notes];
        for(let i = 0; i < newNotes.length - 1; i++) {
            [newNotes[i], newNotes[i+1]] = [newNotes[i+1], newNotes[i]];
        }
        return newNotes;
    }
}