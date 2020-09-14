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

export default class Pattern extends Array {
    mirrorPattern() {
        this.push(...this.slice(1, -1).reverse());
    }
    appendOctaves(octaves) {
        for(let octave = 0; octave < octaves; octave++) {
            this.push(this.changeOctave(octave));
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
}
let pattern = new Pattern();
pattern.push({note: 'A', length: 5}, {note: 'B', length: 2});
console.log(pattern);
console.log(pattern.constructor == Array);
console.log(pattern.constructor == Pattern);