interface Note {
    freq: number,
    length: number
}

interface NoteContext {
    octave?: number,
    length?: number,
    rootFreq?: number,
    wholeNoteLength: number,
}