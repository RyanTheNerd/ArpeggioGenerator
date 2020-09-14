/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/arpeggio.ts":
/*!*************************!*\
  !*** ./src/arpeggio.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var oscillator_1 = __webpack_require__(/*! ./oscillator */ "./src/oscillator.ts");
var note_generator_1 = __webpack_require__(/*! ./note_generator */ "./src/note_generator.ts");
var pattern_1 = __webpack_require__(/*! ./pattern */ "./src/pattern.ts");
var Arpeggio = /** @class */ (function () {
    function Arpeggio(ctx, notes, noteContext) {
        this.ctx = ctx;
        this.pattern = new pattern_1.default(notes);
        console.log(this.pattern.notes);
        this.oscil = new oscillator_1.default(ctx);
        this.currentNote = 0;
        this.direction = "normal";
        this.currentDirection = "accending";
        this.noteContext = noteContext;
        this.noteGenerator = new note_generator_1.default(this.noteContext);
    }
    Arpeggio.prototype.playNextNote = function (startTime) {
        var _this = this;
        if (startTime === void 0) { startTime = 0; }
        var note = this.noteGenerator.compile(this.pattern.notes[this.currentNote]);
        this.oscil.setFreq(note.freq, startTime);
        var time = this.ctx.currentTime;
        window.setTimeout(function () {
            _this.playNextNote(time + note.length);
        }, (note.length) * 1000);
        this.currentNote++;
        this.currentNote %= this.pattern.notes.length;
    };
    Arpeggio.prototype.start = function () {
        this.oscil.start();
        this.playNextNote();
    };
    Arpeggio.prototype.stop = function () {
        this.oscil.stop();
    };
    return Arpeggio;
}());
exports.default = Arpeggio;


/***/ }),

/***/ "./src/arpeggio_generator.ts":
/*!***********************************!*\
  !*** ./src/arpeggio_generator.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var note_data_1 = __webpack_require__(/*! ./note_data */ "./src/note_data.ts");
var arpeggio_1 = __webpack_require__(/*! ./arpeggio */ "./src/arpeggio.ts");
var ArpeggioGenerator = /** @class */ (function () {
    function ArpeggioGenerator() {
        var _this = this;
        this.ctx = new AudioContext();
        this.wholeNoteLength = 1;
        this.arpeggios = [];
        document.querySelector('#stop').onclick = function () {
            _this.stop();
        };
    }
    ArpeggioGenerator.prototype.addArpeggio = function (notes, noteContext) {
        var arpeggio = new arpeggio_1.default(this.ctx, notes, noteContext);
        this.arpeggios.push(arpeggio);
        return arpeggio;
    };
    ArpeggioGenerator.prototype.patternFromChord = function (chordName) {
        var chord = note_data_1.CHORDS[chordName];
        return chord.map(function (halfSteps) {
            return { halfSteps: halfSteps };
        });
    };
    ArpeggioGenerator.prototype.stop = function () {
        this.arpeggios.forEach(function (a) { return a.stop(); });
    };
    return ArpeggioGenerator;
}());
exports.default = ArpeggioGenerator;


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var arpeggio_generator_1 = __webpack_require__(/*! ./arpeggio_generator */ "./src/arpeggio_generator.ts");
document.querySelector("#start").onclick = function () {
    var arpeggioGenerator = new arpeggio_generator_1.default();
    var arpeggio = arpeggioGenerator.addArpeggio(arpeggioGenerator.patternFromChord("Major 7th"), {
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
};


/***/ }),

/***/ "./src/note_data.ts":
/*!**************************!*\
  !*** ./src/note_data.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.NOTES = exports.WAVEFORMS = exports.CHORDS = void 0;
exports.CHORDS = {
    "Major Triad": [1, 5, 8],
    "Minor Triad": [1, 4, 8],
    "7th": [1, 5, 8, 11],
    "Major 7th": [1, 5, 8, 12],
    "Minor 7th": [1, 4, 8, 11],
    "6th": [1, 5, 6, 8],
    "9th": [1, 2, 5, 8, 11],
    "Major 9th": [1, 3, 5, 8, 12],
    "Add 9": [1, 5, 8, 9],
    "Sus 4": [1, 5, 6, 8],
    "Dim": [1, 4, 7],
    "Dim 7": [1, 4, 7, 10],
    "Augmented 5th": [1, 5, 9],
    "Custom": [1, 5, 8],
};
exports.WAVEFORMS = ["sine", "square", "triangle", "sawtooth"];
exports.NOTES = [
    ['A'],
    ['A#', 'Bb'],
    ['B'],
    ['B#', 'C'],
    ['C#', 'Db'],
    ['D'],
    ['D#', 'Eb'],
    ['E', 'Fb'],
    ['E#', 'F'],
    ['F#', 'Gb'],
    ['G'],
    ['G#', 'Ab']
];


/***/ }),

/***/ "./src/note_generator.ts":
/*!*******************************!*\
  !*** ./src/note_generator.ts ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var note_data_1 = __webpack_require__(/*! ./note_data */ "./src/note_data.ts");
var NoteGenerator = /** @class */ (function () {
    function NoteGenerator(noteContext) {
        this.noteContext = noteContext;
    }
    NoteGenerator.prototype.compile = function (note) {
        var length;
        if ('length' in note)
            length = note.length * this.noteContext.wholeNoteLength;
        else
            length = this.noteContext.wholeNoteLength;
        var freq;
        if ('freq' in note) {
            freq = note.freq;
        }
        else {
            var octave = 'octave' in note ? note.octave : 0;
            octave += 'octave' in this.noteContext ? this.noteContext.octave : 0;
            var halfSteps = void 0;
            if ('note' in note) {
                halfSteps = this.noteToHalfSteps(note.note);
            }
            else if ('halfSteps' in note) {
                halfSteps = note.halfSteps;
            }
            else
                halfSteps = 0;
            freq = this.halfStepsToFreq(halfSteps, octave);
        }
        return {
            freq: freq,
            length: length,
        };
    };
    NoteGenerator.prototype.noteToHalfSteps = function (noteName) {
        for (var i = 0; i < note_data_1.NOTES.length; i++) {
            if (note_data_1.NOTES[i].includes(noteName))
                return i;
        }
        console.error("noteToHalfSteps failed: Invalid note name: " + noteName);
    };
    NoteGenerator.prototype.halfStepsToFreq = function (halfSteps, octave) {
        if (octave === void 0) { octave = 0; }
        return Math.pow(2, (halfSteps + (octave * 12)) / 12) * this.noteContext.rootFreq;
    };
    return NoteGenerator;
}());
exports.default = NoteGenerator;


/***/ }),

/***/ "./src/oscillator.ts":
/*!***************************!*\
  !*** ./src/oscillator.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var Oscillator = /** @class */ (function () {
    function Oscillator(ctx) {
        this.ctx = ctx;
        this.gain = this.ctx.createGain();
        this.oscil = this.ctx.createOscillator();
        this.oscil.connect(this.gain);
        this.oscil.type = "square";
        this.gain.connect(this.ctx.destination);
        this.setGain(1);
    }
    Oscillator.prototype.stop = function () {
        this.oscil.stop();
    };
    Oscillator.prototype.start = function () {
        this.oscil.start();
    };
    Oscillator.prototype.setFreq = function (freq, startTime) {
        if (startTime === void 0) { startTime = 0; }
        this.oscil.frequency.setValueAtTime(freq, this.ctx.currentTime + startTime);
    };
    Oscillator.prototype.setGain = function (percent) {
        this.gain.gain.setValueAtTime(percent / 100, this.ctx.currentTime);
    };
    return Oscillator;
}());
exports.default = Oscillator;


/***/ }),

/***/ "./src/pattern.ts":
/*!************************!*\
  !*** ./src/pattern.ts ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var note_data_1 = __webpack_require__(/*! ./note_data */ "./src/note_data.ts");
function fromChord(chordName) {
    return note_data_1.CHORDS[chordName].map(function (halfSteps) {
        return { halfSteps: halfSteps };
    });
}
var DEFAULT_NOTE_VALUES = {
    octave: 0,
    length: 1,
};
var Pattern = /** @class */ (function () {
    function Pattern(notes) {
        this.notes = notes.map(function (note) {
            return Object.assign({}, DEFAULT_NOTE_VALUES, note);
        });
    }
    Pattern.prototype.appendNotes = function (notes) {
        this.notes = __spreadArrays(this.notes, notes);
    };
    Pattern.prototype.copyNotes = function () {
        return __spreadArrays(this.notes);
    };
    Pattern.prototype.mirrorPattern = function () {
        this.notes = __spreadArrays(this.copyNotes(), this.reverseNotes().slice(1, -1));
    };
    Pattern.prototype.appendOctaves = function (octaves) {
        for (var octave = 0; octave < octaves; octave++) {
            this.appendNotes(this.changeOctave(this.copyNotes(), octave));
        }
    };
    Pattern.prototype.changeOctave = function (notes, octave) {
        return notes.map(function (note) {
            var newNote = Object.assign({}, note);
            newNote.octave += octave;
            return newNote;
        });
    };
    Pattern.prototype.reverseNotes = function (notes) {
        if (notes === void 0) { notes = this.notes; }
        return __spreadArrays(notes).reverse();
    };
    Pattern.prototype.swapEveryOther = function (notes) {
        var _a;
        if (notes === void 0) { notes = this.notes; }
        var newNotes = __spreadArrays(notes);
        for (var i = 0; i < newNotes.length - 1; i++) {
            _a = [newNotes[i + 1], newNotes[i]], newNotes[i] = _a[0], newNotes[i + 1] = _a[1];
        }
        return newNotes;
    };
    return Pattern;
}());
exports.default = Pattern;


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FycGVnZ2lvLnRzIiwid2VicGFjazovLy8uL3NyYy9hcnBlZ2dpb19nZW5lcmF0b3IudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9ub3RlX2RhdGEudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL25vdGVfZ2VuZXJhdG9yLnRzIiwid2VicGFjazovLy8uL3NyYy9vc2NpbGxhdG9yLnRzIiwid2VicGFjazovLy8uL3NyYy9wYXR0ZXJuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQ2xGQSxrRkFBc0M7QUFDdEMsOEZBQTZDO0FBQzdDLHlFQUFnQztBQUVoQztJQVNHLGtCQUFZLEdBQWlCLEVBQUUsS0FBa0IsRUFBRSxXQUF3QjtRQUN4RSxJQUFJLENB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VUFBQyxJQUFJO1lBQ2xCLElBQUksT0FBTyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO1lBQ3RDLE9BQU8sQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDO1lBQ3pCLE9BQU8sT0FBTyxDQUFDO1FBQ25CLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUNELDhCQUFZLEdBQVosVUFBYSxLQUFrQjtRQUFsQixnQ0FBUSxJQUFJLENBQUMsS0FBSztRQUMzQixPQUFPLGVBQUksS0FBSyxFQUFFLE9BQU8sRUFBRSxDQUFDO0lBQ2hDLENBQUM7SUFDRCxnQ0FBYyxHQUFkLFVBQWUsS0FBa0I7O1FBQWxCLGdDQUFRLElBQUksQ0FBQyxLQUFLO1FBQzdCLElBQUksUUFBUSxrQkFBTyxLQUFLLENBQUMsQ0FBQztRQUMxQixLQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7WUFDekMsS0FBK0IsQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUExRCxRQUFRLENBQUMsQ0FBQyxDQUFDLFVBQUUsUUFBUSxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsU0FBaUM7U0FDL0Q7UUFDRCxPQUFPLFFBQVEsQ0FBQztJQUNwQixDQUFDO0lBQ0wsY0FBQztBQUFELENBQUMiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCJpbXBvcnQgT3NjaWxsYXRvciBmcm9tICcuL29zY2lsbGF0b3InO1xuaW1wb3J0IE5vdGVHZW5lcmF0b3IgZnJvbSAnLi9ub3RlX2dlbmVyYXRvcic7XG5pbXBvcnQgUGF0dGVybiBmcm9tICcuL3BhdHRlcm4nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBcnBlZ2dpbyB7XG4gICAgY3R4OiBBdWRpb0NvbnRleHQ7XG4gICAgcGF0dGVybjogUGF0dGVybjtcbiAgICBvc2NpbDogT3NjaWxsYXRvcjtcbiAgICBjdXJyZW50Tm90ZTogbnVtYmVyO1xuICAgIGRpcmVjdGlvbjogXCJub3JtYWxcIiB8IFwicmV2ZXJzZVwiIHwgXCJhbHRlcm5hdGVcIiB8IFwicmFuZG9tXCI7XG4gICAgY3VycmVudERpcmVjdGlvbjogXCJhY2NlbmRpbmdcIiB8IFwiZGVjZW5kaW5nXCI7XG4gICAgbm90ZUNvbnRleHQ6IE5vdGVDb250ZXh0O1xuICAgIG5vdGVHZW5lcmF0b3I6IE5vdGVHZW5lcmF0b3I7XG4gICBjb25zdHJ1Y3RvcihjdHg6IEF1ZGlvQ29udGV4dCwgbm90ZXM6IEFycmF5PE5vdGU+LCBub3RlQ29udGV4dDogTm90ZUNvbnRleHQpIHtcbiAgICAgIHRoaXMuY3R4ID0gY3R4O1xuICAgICAgdGhpcy5wYXR0ZXJuID0gbmV3IFBhdHRlcm4obm90ZXMpO1xuICAgICAgY29uc29sZS5sb2codGhpcy5wYXR0ZXJuLm5vdGVzKTtcbiAgICAgIHRoaXMub3NjaWwgPSBuZXcgT3NjaWxsYXRvcihjdHgpO1xuICAgICAgdGhpcy5jdXJyZW50Tm90ZSA9IDA7XG4gICAgICB0aGlzLmRpcmVjdGlvbiA9IFwibm9ybWFsXCI7XG4gICAgICB0aGlzLmN1cnJlbnREaXJlY3Rpb249IFwiYWNjZW5kaW5nXCI7XG4gICAgICBcbiAgICAgIHRoaXMubm90ZUNvbnRleHQgPSBub3RlQ29udGV4dDtcbiAgICAgIHRoaXMubm90ZUdlbmVyYXRvciA9IG5ldyBOb3RlR2VuZXJhdG9yKHRoaXMubm90ZUNvbnRleHQpO1xuICAgfVxuICAgcGxheU5leHROb3RlKHN0YXJ0VGltZTogbnVtYmVyID0gMCkge1xuICAgICAgbGV0IG5vdGUgPSB0aGlzLm5vdGVHZW5lcmF0b3IuY29tcGlsZSh0aGlzLnBhdHRlcm4ubm90ZXNbdGhpcy5jdXJyZW50Tm90ZV0pO1xuICAgICAgdGhpcy5vc2NpbC5zZXRGcmVxKG5vdGUuZnJlcSwgc3RhcnRUaW1lKTtcbiAgICAgIGxldCB0aW1lID0gdGhpcy5jdHguY3VycmVudFRpbWU7XG4gICAgICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICB0aGlzLnBsYXlOZXh0Tm90ZSh0aW1lICsgbm90ZS5sZW5ndGgpOyBcbiAgICAgIH0sIChub3RlLmxlbmd0aCkgKiAxMDAwKTtcbiAgICAgIHRoaXMuY3VycmVudE5vdGUrKztcbiAgICAgIHRoaXMuY3VycmVudE5vdGUgJT0gdGhpcy5wYXR0ZXJuLm5vdGVzLmxlbmd0aDtcbiAgIH1cbiAgIHN0YXJ0KCkge1xuICAgICAgdGhpcy5vc2NpbC5zdGFydCgpO1xuICAgICAgdGhpcy5wbGF5TmV4dE5vdGUoKTtcbiAgIH1cbiAgIHN0b3AoKSB7XG4gICAgICB0aGlzLm9zY2lsLnN0b3AoKTtcbiAgIH1cbn0iLCJpbXBvcnQge0NIT1JEU30gZnJvbSAnLi9ub3RlX2RhdGEnO1xuaW1wb3J0IEFycGVnZ2lvIGZyb20gJy4vYXJwZWdnaW8nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBcnBlZ2dpb0dlbmVyYXRvciB7XG4gICAgY3R4OiBBdWRpb0NvbnRleHQ7XG4gICAgd2hvbGVOb3RlTGVuZ3RoOiBudW1iZXI7XG4gICAgYXJwZWdnaW9zOiBBcnJheTxBcnBlZ2dpbz47XG5cbiAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgdGhpcy5jdHggPSBuZXcgQXVkaW9Db250ZXh0KCk7XG4gICAgICB0aGlzLndob2xlTm90ZUxlbmd0aCA9IDE7XG4gICAgICB0aGlzLmFycGVnZ2lvcyA9IFtdO1xuICAgICAgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzdG9wJykgYXMgSFRNTEVsZW1lbnQpLm9uY2xpY2sgPSAoKSA9PiB7XG4gICAgICAgICB0aGlzLnN0b3AoKTtcbiAgICAgIH07XG4gICB9XG4gICBhZGRBcnBlZ2dpbyhub3Rlcywgbm90ZUNvbnRleHQpIHtcbiAgICAgIGxldCBhcnBlZ2dpbyA9IG5ldyBBcnBlZ2dpbyh0aGlzLmN0eCwgbm90ZXMsIG5vdGVDb250ZXh0KTtcbiAgICAgIHRoaXMuYXJwZWdnaW9zLnB1c2goYXJwZWdnaW8pO1xuICAgICAgcmV0dXJuIGFycGVnZ2lvO1xuICAgfVxuICAgcGF0dGVybkZyb21DaG9yZChjaG9yZE5hbWUpIHtcbiAgICAgIGxldCBjaG9yZCA9IENIT1JEU1tjaG9yZE5hbWVdO1xuICAgICAgcmV0dXJuIGNob3JkLm1hcCgoaGFsZlN0ZXBzKSA9PiB7XG4gICAgICAgICByZXR1cm4ge2hhbGZTdGVwczogaGFsZlN0ZXBzfVxuICAgICAgfSk7XG4gICB9XG4gICBzdG9wKCkge1xuICAgICAgdGhpcy5hcnBlZ2dpb3MuZm9yRWFjaCgoYSkgPT4gYS5zdG9wKCkpO1xuICAgfVxufSIsImltcG9ydCBBcnBlZ2dpb0dlbmVyYXRvciBmcm9tICcuL2FycGVnZ2lvX2dlbmVyYXRvcic7XG5cbihkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3N0YXJ0XCIpIGFzIEhUTUxFbGVtZW50KS5vbmNsaWNrID0gKCkgPT4ge1xuICAgbGV0IGFycGVnZ2lvR2VuZXJhdG9yID0gbmV3IEFycGVnZ2lvR2VuZXJhdG9yKCk7XG4gICBcbiAgIGxldCBhcnBlZ2dpbyA9IGFycGVnZ2lvR2VuZXJhdG9yLmFkZEFycGVnZ2lvKGFycGVnZ2lvR2VuZXJhdG9yLnBhdHRlcm5Gcm9tQ2hvcmQoXCJNYWpvciA3dGhcIiksIHtcbiAgICAgIG9jdGF2ZTogLTIsXG4gICAgICByb290RnJlcTogNDQwLFxuICAgICAgd2hvbGVOb3RlTGVuZ3RoOiAwLjA1XG4gICB9KTtcbiAgIGFycGVnZ2lvLnBhdHRlcm4uYXBwZW5kT2N0YXZlcygzKTtcbiAgIGFycGVnZ2lvLnBhdHRlcm4uYXBwZW5kTm90ZXMoYXJwZWdnaW8ucGF0dGVybi5zd2FwRXZlcnlPdGhlcihhcnBlZ2dpby5wYXR0ZXJuLmNvcHlOb3RlcygpKSk7XG4gICBjb25zb2xlLmxvZyhhcnBlZ2dpby5wYXR0ZXJuLm5vdGVzKTtcbiAgIGFycGVnZ2lvLnN0YXJ0KCk7XG4gICAvLyBsZXQgYXJwZWdnaW8gPSBhcnBlZ2dpb0dlbmVyYXRvci5hZGRBcnBlZ2dpbyhbXG4gICAgICAvLyB7bm90ZTogJ0MnLCBvY3RhdmU6IDF9LFxuICAgICAgLy8ge25vdGU6ICdFJ30sXG4gICAgICAvLyB7bm90ZTogJ0cnLCBvY3RhdmU6IC0xfSxcbiAgIC8vIF0sIHtcbiAgICAgIC8vIGRpcmVjdGlvbjogXCJhbHRlcm5hdGVcIixcbiAgICAgIC8vIHdob2xlTm90ZUxlbmd0aDogMC41LFxuICAgICAgLy8gb2N0YXZlczogNCxcbiAgICAgIC8vIG9jdGF2ZTogLTIsXG4gICAgICAvLyByb290RnJlcTogNDQwXG4gICAvLyB9KTtcbn0iLCJleHBvcnQgY29uc3QgQ0hPUkRTID0ge1xuICAgIFwiTWFqb3IgVHJpYWRcIjogWzEsIDUsIDhdLFxuICAgIFwiTWlub3IgVHJpYWRcIjogWzEsIDQsIDhdLFxuICAgIFwiN3RoXCI6IFsxLCA1LCA4LCAxMV0sXG4gICAgXCJNYWpvciA3dGhcIjogWzEsIDUsIDgsIDEyXSxcbiAgICBcIk1pbm9yIDd0aFwiOiBbMSwgNCwgOCwgMTFdLFxuICAgIFwiNnRoXCI6IFsxLCA1LCA2LCA4XSxcbiAgICBcIjl0aFwiOiBbMSwgMiwgNSwgOCwgMTFdLFxuICAgIFwiTWFqb3IgOXRoXCI6IFsxLCAzLCA1LCA4LCAxMl0sXG4gICAgXCJBZGQgOVwiOiBbMSwgNSwgOCwgOV0sXG4gICAgXCJTdXMgNFwiOiBbMSwgNSwgNiwgOF0sXG4gICAgXCJEaW1cIjogWzEsIDQsIDddLFxuICAgIFwiRGltIDdcIjogWzEsIDQsIDcsIDEwXSxcbiAgICBcIkF1Z21lbnRlZCA1dGhcIjogWzEsIDUsIDldLFxuICAgIFwiQ3VzdG9tXCI6IFsxLCA1LCA4XSxcbn07XG5cbmV4cG9ydCBjb25zdCBXQVZFRk9STVMgPSBbXCJzaW5lXCIsIFwic3F1YXJlXCIsIFwidHJpYW5nbGVcIiwgXCJzYXd0b290aFwiXTtcblxuZXhwb3J0IGNvbnN0IE5PVEVTID0gW1xuICAgWydBJ10sXG4gICBbJ0EjJywgJ0JiJ10sXG4gICBbJ0InXSxcbiAgIFsnQiMnLCAnQyddLFxuICAgWydDIycsICdEYiddLFxuICAgWydEJ10sXG4gICBbJ0QjJywgJ0ViJ10sXG4gICBbJ0UnLCAnRmInXSxcbiAgIFsnRSMnLCAnRiddLFxuICAgWydGIycsICdHYiddLFxuICAgWydHJ10sXG4gICBbJ0cjJywgJ0FiJ11cbl07IiwiaW1wb3J0IHtOT1RFU30gZnJvbSAnLi9ub3RlX2RhdGEnO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTm90ZUdlbmVyYXRvciB7XG4gICAgIG5vdGVDb250ZXh0OiBOb3RlQ29udGV4dDtcbiAgICBjb25zdHJ1Y3Rvcihub3RlQ29udGV4dCkge1xuICAgICAgICB0aGlzLm5vdGVDb250ZXh0ID0gbm90ZUNvbnRleHQ7XG4gICAgfVxuICAgIGNvbXBpbGUobm90ZSkge1xuICAgICAgICBsZXQgbGVuZ3RoOiBudW1iZXI7XG4gICAgICAgIGlmKCdsZW5ndGgnIGluIG5vdGUpIGxlbmd0aCA9IG5vdGUubGVuZ3RoICogdGhpcy5ub3RlQ29udGV4dC53aG9sZU5vdGVMZW5ndGg7XG4gICAgICAgIGVsc2UgbGVuZ3RoID0gdGhpcy5ub3RlQ29udGV4dC53aG9sZU5vdGVMZW5ndGg7XG4gICAgICAgIFxuICAgICAgICBsZXQgZnJlcTogbnVtYmVyO1xuICAgICAgICBpZignZnJlcScgaW4gbm90ZSkge1xuICAgICAgICAgICAgZnJlcSA9IG5vdGUuZnJlcTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxldCBvY3RhdmUgPSAnb2N0YXZlJyBpbiBub3RlID8gbm90ZS5vY3RhdmUgOiAwO1xuICAgICAgICAgICAgb2N0YXZlICs9ICdvY3RhdmUnIGluIHRoaXMubm90ZUNvbnRleHQgPyB0aGlzLm5vdGVDb250ZXh0Lm9jdGF2ZSA6IDA7XG4gICAgICAgICAgICBsZXQgaGFsZlN0ZXBzOiBudW1iZXI7XG4gICAgICAgICAgICBpZignbm90ZScgaW4gbm90ZSkge1xuICAgICAgICAgICAgICAgIGhhbGZTdGVwcyA9IHRoaXMubm90ZVRvSGFsZlN0ZXBzKG5vdGUubm90ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmKCdoYWxmU3RlcHMnIGluIG5vdGUpIHtcbiAgICAgICAgICAgICAgICBoYWxmU3RlcHMgPSBub3RlLmhhbGZTdGVwcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaGFsZlN0ZXBzID0gMDtcbiAgICAgICAgICAgIGZyZXEgPSB0aGlzLmhhbGZTdGVwc1RvRnJlcShoYWxmU3RlcHMsIG9jdGF2ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGZyZXE6IGZyZXEsXG4gICAgICAgICAgICBsZW5ndGg6IGxlbmd0aCxcbiAgICAgICAgfVxuICAgIH1cbiAgICBub3RlVG9IYWxmU3RlcHMobm90ZU5hbWU6IHN0cmluZykge1xuICAgICAgICBmb3IobGV0IGkgPSAwOyBpIDwgTk9URVMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGlmKE5PVEVTW2ldLmluY2x1ZGVzKG5vdGVOYW1lKSkgcmV0dXJuIGk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5lcnJvcihgbm90ZVRvSGFsZlN0ZXBzIGZhaWxlZDogSW52YWxpZCBub3RlIG5hbWU6ICR7bm90ZU5hbWV9YCk7XG4gICAgfVxuICAgIGhhbGZTdGVwc1RvRnJlcShoYWxmU3RlcHM6IG51bWJlciwgb2N0YXZlOiBudW1iZXIgPSAwKSB7XG4gICAgICAgIHJldHVybiBNYXRoLnBvdygyLCAoaGFsZlN0ZXBzICsgKG9jdGF2ZSAqIDEyKSkvMTIpICogdGhpcy5ub3RlQ29udGV4dC5yb290RnJlcTtcbiAgICB9XG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgT3NjaWxsYXRvciB7XG4gICBjdHg6IEF1ZGlvQ29udGV4dDtcbiAgIGdhaW46IEdhaW5Ob2RlO1xuICAgb3NjaWw6IE9zY2lsbGF0b3JOb2RlO1xuXG4gICBjb25zdHJ1Y3RvcihjdHgpIHtcbiAgICAgIHRoaXMuY3R4ID0gY3R4O1xuICAgICAgdGhpcy5nYWluID0gdGhpcy5jdHguY3JlYXRlR2FpbigpO1xuICAgICAgdGhpcy5vc2NpbCA9IHRoaXMuY3R4LmNyZWF0ZU9zY2lsbGF0b3IoKTtcbiAgICAgIHRoaXMub3NjaWwuY29ubmVjdCh0aGlzLmdhaW4pO1xuICAgICAgdGhpcy5vc2NpbC50eXBlID0gXCJzcXVhcmVcIjtcbiAgICAgIHRoaXMuZ2Fpbi5jb25uZWN0KHRoaXMuY3R4LmRlc3RpbmF0aW9uKTtcbiAgICAgIFxuICAgICAgdGhpcy5zZXRHYWluKDEpO1xuICAgICAgXG4gICB9XG4gICBzdG9wKCkge1xuICAgICAgdGhpcy5vc2NpbC5zdG9wKCk7XG4gICB9XG4gICBzdGFydCgpIHtcbiAgICAgIHRoaXMub3NjaWwuc3RhcnQoKTtcbiAgIH1cbiAgIHNldEZyZXEoZnJlcTogbnVtYmVyLCBzdGFydFRpbWUgPSAwKSB7XG4gICAgICB0aGlzLm9zY2lsLmZyZXF1ZW5jeS5zZXRWYWx1ZUF0VGltZShmcmVxLCB0aGlzLmN0eC5jdXJyZW50VGltZSArIHN0YXJ0VGltZSk7XG4gICB9XG4gICBzZXRHYWluKHBlcmNlbnQ6IG51bWJlcikge1xuICAgICAgdGhpcy5nYWluLmdhaW4uc2V0VmFsdWVBdFRpbWUocGVyY2VudC8xMDAsIHRoaXMuY3R4LmN1cnJlbnRUaW1lKTtcbiAgIH1cbn0iLCJpbXBvcnQge0NIT1JEU30gZnJvbSAnLi9ub3RlX2RhdGEnO1xuXG5cbmZ1bmN0aW9uIGZyb21DaG9yZChjaG9yZE5hbWUpIHtcbiAgICByZXR1cm4gQ0hPUkRTW2Nob3JkTmFtZV0ubWFwKChoYWxmU3RlcHMpID0+IHtcbiAgICAgICAgcmV0dXJuIHtoYWxmU3RlcHM6IGhhbGZTdGVwc31cbiAgICB9KTtcbn1cblxuY29uc3QgREVGQVVMVF9OT1RFX1ZBTFVFUyA9IHtcbiAgICBvY3RhdmU6IDAsIFxuICAgIGxlbmd0aDogMSxcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGF0dGVybiB7XG4gICAgbm90ZXM6IEFycmF5PE5vdGVDb25maWc+O1xuICAgIGNvbnN0cnVjdG9yKG5vdGVzKSB7XG4gICAgICAgIHRoaXMubm90ZXMgPSBub3Rlcy5tYXAoKG5vdGUpID0+IHtcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX05PVEVfVkFMVUVTLCBub3RlKTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGFwcGVuZE5vdGVzKG5vdGVzKSB7XG4gICAgICAgIHRoaXMubm90ZXMgPSBbLi4udGhpcy5ub3RlcywgLi4ubm90ZXNdO1xuICAgIH1cbiAgICBjb3B5Tm90ZXMoKSB7XG4gICAgICAgIHJldHVybiBbLi4udGhpcy5ub3Rlc107XG4gICAgfVxuICAgIG1pcnJvclBhdHRlcm4oKSB7XG4gICAgICAgIHRoaXMubm90ZXMgPSBbLi4udGhpcy5jb3B5Tm90ZXMoKSwgLi4udGhpcy5yZXZlcnNlTm90ZXMoKS5zbGljZSgxLCAtMSldO1xuICAgIH1cbiAgICBhcHBlbmRPY3RhdmVzKG9jdGF2ZXMpIHtcbiAgICAgICAgZm9yKGxldCBvY3RhdmUgPSAwOyBvY3RhdmUgPCBvY3RhdmVzOyBvY3RhdmUrKykge1xuICAgICAgICAgICAgdGhpcy5hcHBlbmROb3Rlcyh0aGlzLmNoYW5nZU9jdGF2ZSh0aGlzLmNvcHlOb3RlcygpLCBvY3RhdmUpKTtcbiAgICAgICAgfVxuXG4gICAgfVxuICAgIGNoYW5nZU9jdGF2ZShub3Rlcywgb2N0YXZlKSB7XG4gICAgICAgIHJldHVybiBub3Rlcy5tYXAoKG5vdGUpID0+IHtcbiAgICAgICAgICAgIGxldCBuZXdOb3RlID0gT2JqZWN0LmFzc2lnbih7fSwgbm90ZSk7XG4gICAgICAgICAgICBuZXdOb3RlLm9jdGF2ZSArPSBvY3RhdmU7XG4gICAgICAgICAgICByZXR1cm4gbmV3Tm90ZTtcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHJldmVyc2VOb3Rlcyhub3RlcyA9IHRoaXMubm90ZXMpIHtcbiAgICAgICAgcmV0dXJuIFsuLi5ub3Rlc10ucmV2ZXJzZSgpO1xuICAgIH1cbiAgICBzd2FwRXZlcnlPdGhlcihub3RlcyA9IHRoaXMubm90ZXMpIHtcbiAgICAgICAgbGV0IG5ld05vdGVzID0gWy4uLm5vdGVzXTtcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IG5ld05vdGVzLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICAgICAgW25ld05vdGVzW2ldLCBuZXdOb3Rlc1tpKzFdXSA9IFtuZXdOb3Rlc1tpKzFdLCBuZXdOb3Rlc1tpXV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ld05vdGVzO1xuICAgIH1cbn0iXSwic291cmNlUm9vdCI6IiJ9