import {CHORDS, NOTES} from './note_data';


export function fromChord(chordName) {
    return CHORDS[chordName].map((halfSteps) => {
        return {halfSteps: halfSteps}
    });
}
export function mirrorPattern(pattern) {
    pattern.push(...pattern.slice(1, -1).reverse());
    return pattern;
}
export function appendOctaves(pattern, octaves) {
    for(let octave = 1; octave < octaves; octave++) {
        pattern.push(...changeOctave(pattern,octave));
    }
    return pattern;
}

export function changeOctave(pattern, octave) {
    return pattern.map((note) => {
        let newNote = Object.assign({}, note);
        newNote.octave += octave;
        return newNote;
    });
}
export function swapEveryOther(pattern) {
    for(let i = 0; i < pattern.length - 1; i++) {
        [pattern[i], pattern[i+1]] = [pattern[i+1], pattern[i]];
    }
    return pattern;
}
export function invertNotes(pattern) {
    for(let note of pattern) {
        let halfSteps;
        let noteType = "halfSteps" in note ? "halfSteps" : ("note" in note ? "note" : null);
        if(noteType == "halfSteps") {
            halfSteps = note.halfSteps;
        }
        else if(noteType == "note") {
            halfSteps = NOTES.indexOf(note.note);
        }
        else console.error("No note or halfstep specified!");

        if(halfSteps == 5 || halfSteps == 6) continue;

        else {
            halfSteps = 11 - halfSteps;
        }
        if(noteType == "note") note.note = NOTES[halfSteps];
        else note.halfSteps = halfSteps;

    }
    return pattern;
}
export function everyNthNote(pattern, method, interval, methodArgs) {    // Only works on methods that modify array in place
    let newPattern = pattern.slice();
    newPattern = method(newPattern, ...methodArgs);
    for(let i = 0; i < pattern.length; i += interval) {
        pattern[i] = newPattern[i];
    }
    return pattern;
}