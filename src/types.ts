interface Note {
    freq: number,
    length: number
}

interface NoteConfig {
    note?: number,
    halfSteps?: number,
    octave: number,
    length: number
}

interface NoteContext {
    octave?: number,
    rootFreq?: number,
    wholeNoteLength: number,
}
