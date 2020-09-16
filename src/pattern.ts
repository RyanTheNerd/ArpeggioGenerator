import {CHORDS, NOTES} from './note_data';


function fromChord(chordName) {
    return CHORDS[chordName].map((halfSteps) => {
        return {halfSteps: halfSteps}
    });
}

export default class Pattern extends Array {
    mirrorPattern() {
        this.push(...this.slice(1, -1).reverse());
    }
    appendOctaves(octaves) {
        for(let octave = 1; octave < octaves; octave++) {
            this.push(...this.changeOctave(octave));
        }
    }
    changeOctave(octave) {
        return this.map((note) => {
            let newNote = Object.assign({}, note);
            newNote.octave += octave;
            return newNote;
        });
    }
    swapEveryOther() {
        for(let i = 0; i < this.length - 1; i++) {
            [this[i], this[i+1]] = [this[i+1], this[i]];
        }
    }
    invertNotes() {
        for(let note of this) {
            if("halfSteps" in note) note.halfSteps = 12 - note.halfSteps;
            else if("note" in note) note.note = 12 - NOTES.indexOf(note.note);
            else console.error("No note or halfstep specified!");
        }
        return this;
    }
    copy() {
        let newPattern = new Pattern();
        newPattern.push(...this.map((note) => Object.assign({}, note)));
        return newPattern;
    }
}