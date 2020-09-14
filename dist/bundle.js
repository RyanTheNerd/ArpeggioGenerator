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
var Arpeggio = /** @class */ (function () {
    function Arpeggio(ctx, pattern, noteContext) {
        this.ctx = ctx;
        this.pattern = pattern;
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
        var note = this.noteGenerator.compile(this.pattern[this.currentNote]);
        this.oscil.setFreq(note.freq, startTime);
        var time = this.ctx.currentTime;
        window.setTimeout(function () {
            _this.playNextNote(time + note.length);
        }, (note.length) * 1000);
        this.currentNote++;
        this.currentNote %= this.pattern.length;
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
var pattern_1 = __webpack_require__(/*! ./pattern */ "./src/pattern.ts");
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
        var pattern = new pattern_1.default();
        pattern.push.apply(pattern, notes);
        var arpeggio = new arpeggio_1.default(this.ctx, pattern, noteContext);
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
        rootFreq: 60,
        wholeNoteLength: 0.05
    });
    var pattern = arpeggio.pattern;
    pattern.appendOctaves(3);
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

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var Pattern = /** @class */ (function (_super) {
    __extends(Pattern, _super);
    function Pattern() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Pattern.prototype.mirrorPattern = function () {
        this.push.apply(this, this.slice(1, -1).reverse());
    };
    Pattern.prototype.appendOctaves = function (octaves) {
        for (var octave = 0; octave < octaves; octave++) {
            this.push(this.changeOctave(octave));
        }
    };
    Pattern.prototype.changeOctave = function (octave) {
        return this.map(function (note) {
            var newNote = Object.assign({}, note);
            newNote.octave += octave;
            return newNote;
        });
    };
    Pattern.prototype.swapEveryOther = function () {
        var _a;
        for (var i = 0; i < this.length - 1; i++) {
            _a = [this[i + 1], this[i]], this[i] = _a[0], this[i + 1] = _a[1];
        }
    };
    return Pattern;
}(Array));
exports.default = Pattern;
var pattern = new Pattern();
pattern.push({ note: 'A', length: 5 }, { note: 'B', length: 2 });
console.log(pattern);
console.log(pattern.constructor == Array);
console.log(pattern.constructor == Pattern);


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FycGVnZ2lvLnRzIiwid2VicGFjazovLy8uL3NyYy9hcnBlZ2dpb19nZW5lcmF0b3IudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9ub3RlX2RhdGEudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL25vdGVfZ2VuZXJhdG9yLnRzIiwid2VicGFjazovLy8uL3NyYy9vc2NpbGxhdG9yLnRzIiwid2VicGFjazovLy8uL3NyYy9wYXR0ZXJuLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7Ozs7OztBQ2xGQSxrRkFBc0M7QUFDdEMsOEZBQTZDO0FBRzdDO0lBU0csa0JBQVksR0FBaUIsRUFBRSxPQUFnQixFQUFFLFdBQXdCO1FBQ3RFLElBQUksQ0FBQyxHQUFHLEdBQUcs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LElBQUksQ0FBQyxFQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLENBQUMsRUFBQyxFQUFFLEVBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFDLENBQUMsQ0FBQztBQUM3RCxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ3JCLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFdBQVcsSUFBSSxLQUFLLENBQUMsQ0FBQztBQUMxQyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxXQUFXLElBQUksT0FBTyxDQUFDLENBQUMiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCJpbXBvcnQgT3NjaWxsYXRvciBmcm9tICcuL29zY2lsbGF0b3InO1xuaW1wb3J0IE5vdGVHZW5lcmF0b3IgZnJvbSAnLi9ub3RlX2dlbmVyYXRvcic7XG5pbXBvcnQgUGF0dGVybiBmcm9tICcuL3BhdHRlcm4nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBcnBlZ2dpbyB7XG4gICAgY3R4OiBBdWRpb0NvbnRleHQ7XG4gICAgcGF0dGVybjogUGF0dGVybjtcbiAgICBvc2NpbDogT3NjaWxsYXRvcjtcbiAgICBjdXJyZW50Tm90ZTogbnVtYmVyO1xuICAgIGRpcmVjdGlvbjogXCJub3JtYWxcIiB8IFwicmV2ZXJzZVwiIHwgXCJhbHRlcm5hdGVcIiB8IFwicmFuZG9tXCI7XG4gICAgY3VycmVudERpcmVjdGlvbjogXCJhY2NlbmRpbmdcIiB8IFwiZGVjZW5kaW5nXCI7XG4gICAgbm90ZUNvbnRleHQ6IE5vdGVDb250ZXh0O1xuICAgIG5vdGVHZW5lcmF0b3I6IE5vdGVHZW5lcmF0b3I7XG4gICBjb25zdHJ1Y3RvcihjdHg6IEF1ZGlvQ29udGV4dCwgcGF0dGVybjogUGF0dGVybiwgbm90ZUNvbnRleHQ6IE5vdGVDb250ZXh0KSB7XG4gICAgICB0aGlzLmN0eCA9IGN0eDtcbiAgICAgIHRoaXMucGF0dGVybiA9IHBhdHRlcm47XG4gICAgICB0aGlzLm9zY2lsID0gbmV3IE9zY2lsbGF0b3IoY3R4KTtcbiAgICAgIHRoaXMuY3VycmVudE5vdGUgPSAwO1xuICAgICAgdGhpcy5kaXJlY3Rpb24gPSBcIm5vcm1hbFwiO1xuICAgICAgdGhpcy5jdXJyZW50RGlyZWN0aW9uPSBcImFjY2VuZGluZ1wiO1xuICAgICAgdGhpcy5ub3RlQ29udGV4dCA9IG5vdGVDb250ZXh0O1xuICAgICAgdGhpcy5ub3RlR2VuZXJhdG9yID0gbmV3IE5vdGVHZW5lcmF0b3IodGhpcy5ub3RlQ29udGV4dCk7XG4gICB9XG4gICBwbGF5TmV4dE5vdGUoc3RhcnRUaW1lOiBudW1iZXIgPSAwKSB7XG4gICAgICBsZXQgbm90ZSA9IHRoaXMubm90ZUdlbmVyYXRvci5jb21waWxlKHRoaXMucGF0dGVyblt0aGlzLmN1cnJlbnROb3RlXSk7XG4gICAgICB0aGlzLm9zY2lsLnNldEZyZXEobm90ZS5mcmVxLCBzdGFydFRpbWUpO1xuICAgICAgbGV0IHRpbWUgPSB0aGlzLmN0eC5jdXJyZW50VGltZTtcbiAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgIHRoaXMucGxheU5leHROb3RlKHRpbWUgKyBub3RlLmxlbmd0aCk7IFxuICAgICAgfSwgKG5vdGUubGVuZ3RoKSAqIDEwMDApO1xuICAgICAgdGhpcy5jdXJyZW50Tm90ZSsrO1xuICAgICAgdGhpcy5jdXJyZW50Tm90ZSAlPSB0aGlzLnBhdHRlcm4ubGVuZ3RoO1xuICAgfVxuICAgc3RhcnQoKSB7XG4gICAgICB0aGlzLm9zY2lsLnN0YXJ0KCk7XG4gICAgICB0aGlzLnBsYXlOZXh0Tm90ZSgpO1xuICAgfVxuICAgc3RvcCgpIHtcbiAgICAgIHRoaXMub3NjaWwuc3RvcCgpO1xuICAgfVxufSIsImltcG9ydCB7Q0hPUkRTfSBmcm9tICcuL25vdGVfZGF0YSc7XG5pbXBvcnQgQXJwZWdnaW8gZnJvbSAnLi9hcnBlZ2dpbyc7XG5pbXBvcnQgUGF0dGVybiBmcm9tICcuL3BhdHRlcm4nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBcnBlZ2dpb0dlbmVyYXRvciB7XG4gICAgY3R4OiBBdWRpb0NvbnRleHQ7XG4gICAgd2hvbGVOb3RlTGVuZ3RoOiBudW1iZXI7XG4gICAgYXJwZWdnaW9zOiBBcnJheTxBcnBlZ2dpbz47XG5cbiAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgdGhpcy5jdHggPSBuZXcgQXVkaW9Db250ZXh0KCk7XG4gICAgICB0aGlzLndob2xlTm90ZUxlbmd0aCA9IDE7XG4gICAgICB0aGlzLmFycGVnZ2lvcyA9IFtdO1xuICAgICAgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzdG9wJykgYXMgSFRNTEVsZW1lbnQpLm9uY2xpY2sgPSAoKSA9PiB7XG4gICAgICAgICB0aGlzLnN0b3AoKTtcbiAgICAgIH07XG4gICB9XG4gICBhZGRBcnBlZ2dpbyhub3Rlcywgbm90ZUNvbnRleHQpIHtcbiAgICAgIGxldCBwYXR0ZXJuID0gbmV3IFBhdHRlcm4oKTtcbiAgICAgIHBhdHRlcm4ucHVzaCguLi5ub3Rlcyk7XG4gICAgICBsZXQgYXJwZWdnaW8gPSBuZXcgQXJwZWdnaW8odGhpcy5jdHgsIHBhdHRlcm4sIG5vdGVDb250ZXh0KTtcbiAgICAgIHRoaXMuYXJwZWdnaW9zLnB1c2goYXJwZWdnaW8pO1xuICAgICAgcmV0dXJuIGFycGVnZ2lvO1xuICAgfVxuICAgcGF0dGVybkZyb21DaG9yZChjaG9yZE5hbWUpIHtcbiAgICAgIGxldCBjaG9yZCA9IENIT1JEU1tjaG9yZE5hbWVdO1xuICAgICAgcmV0dXJuIGNob3JkLm1hcCgoaGFsZlN0ZXBzKSA9PiB7XG4gICAgICAgICByZXR1cm4ge2hhbGZTdGVwczogaGFsZlN0ZXBzfVxuICAgICAgfSk7XG4gICB9XG4gICBzdG9wKCkge1xuICAgICAgdGhpcy5hcnBlZ2dpb3MuZm9yRWFjaCgoYSkgPT4gYS5zdG9wKCkpO1xuICAgfVxufSIsImltcG9ydCBBcnBlZ2dpb0dlbmVyYXRvciBmcm9tICcuL2FycGVnZ2lvX2dlbmVyYXRvcic7XG5pbXBvcnQgUGF0dGVybiBmcm9tICcuL3BhdHRlcm4nO1xuXG4oZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIiNzdGFydFwiKSBhcyBIVE1MRWxlbWVudCkub25jbGljayA9ICgpID0+IHtcbiAgIGxldCBhcnBlZ2dpb0dlbmVyYXRvciA9IG5ldyBBcnBlZ2dpb0dlbmVyYXRvcigpO1xuICAgXG4gICBsZXQgYXJwZWdnaW8gPSBhcnBlZ2dpb0dlbmVyYXRvci5hZGRBcnBlZ2dpbyhhcnBlZ2dpb0dlbmVyYXRvci5wYXR0ZXJuRnJvbUNob3JkKFwiTWFqb3IgN3RoXCIpLCB7XG4gICAgICByb290RnJlcTogNjAsXG4gICAgICB3aG9sZU5vdGVMZW5ndGg6IDAuMDVcbiAgIH0pO1xuICAgbGV0IHBhdHRlcm4gPSBhcnBlZ2dpby5wYXR0ZXJuO1xuICAgcGF0dGVybi5hcHBlbmRPY3RhdmVzKDMpO1xuICAgYXJwZWdnaW8uc3RhcnQoKTtcbiAgIC8vIGxldCBhcnBlZ2dpbyA9IGFycGVnZ2lvR2VuZXJhdG9yLmFkZEFycGVnZ2lvKFtcbiAgICAgIC8vIHtub3RlOiAnQycsIG9jdGF2ZTogMX0sXG4gICAgICAvLyB7bm90ZTogJ0UnfSxcbiAgICAgIC8vIHtub3RlOiAnRycsIG9jdGF2ZTogLTF9LFxuICAgLy8gXSwge1xuICAgICAgLy8gZGlyZWN0aW9uOiBcImFsdGVybmF0ZVwiLFxuICAgICAgLy8gd2hvbGVOb3RlTGVuZ3RoOiAwLjUsXG4gICAgICAvLyBvY3RhdmVzOiA0LFxuICAgICAgLy8gb2N0YXZlOiAtMixcbiAgICAgIC8vIHJvb3RGcmVxOiA0NDBcbiAgIC8vIH0pO1xufSIsImV4cG9ydCBjb25zdCBDSE9SRFMgPSB7XG4gICAgXCJNYWpvciBUcmlhZFwiOiBbMSwgNSwgOF0sXG4gICAgXCJNaW5vciBUcmlhZFwiOiBbMSwgNCwgOF0sXG4gICAgXCI3dGhcIjogWzEsIDUsIDgsIDExXSxcbiAgICBcIk1ham9yIDd0aFwiOiBbMSwgNSwgOCwgMTJdLFxuICAgIFwiTWlub3IgN3RoXCI6IFsxLCA0LCA4LCAxMV0sXG4gICAgXCI2dGhcIjogWzEsIDUsIDYsIDhdLFxuICAgIFwiOXRoXCI6IFsxLCAyLCA1LCA4LCAxMV0sXG4gICAgXCJNYWpvciA5dGhcIjogWzEsIDMsIDUsIDgsIDEyXSxcbiAgICBcIkFkZCA5XCI6IFsxLCA1LCA4LCA5XSxcbiAgICBcIlN1cyA0XCI6IFsxLCA1LCA2LCA4XSxcbiAgICBcIkRpbVwiOiBbMSwgNCwgN10sXG4gICAgXCJEaW0gN1wiOiBbMSwgNCwgNywgMTBdLFxuICAgIFwiQXVnbWVudGVkIDV0aFwiOiBbMSwgNSwgOV0sXG4gICAgXCJDdXN0b21cIjogWzEsIDUsIDhdLFxufTtcblxuZXhwb3J0IGNvbnN0IFdBVkVGT1JNUyA9IFtcInNpbmVcIiwgXCJzcXVhcmVcIiwgXCJ0cmlhbmdsZVwiLCBcInNhd3Rvb3RoXCJdO1xuXG5leHBvcnQgY29uc3QgTk9URVMgPSBbXG4gICBbJ0EnXSxcbiAgIFsnQSMnLCAnQmInXSxcbiAgIFsnQiddLFxuICAgWydCIycsICdDJ10sXG4gICBbJ0MjJywgJ0RiJ10sXG4gICBbJ0QnXSxcbiAgIFsnRCMnLCAnRWInXSxcbiAgIFsnRScsICdGYiddLFxuICAgWydFIycsICdGJ10sXG4gICBbJ0YjJywgJ0diJ10sXG4gICBbJ0cnXSxcbiAgIFsnRyMnLCAnQWInXVxuXTsiLCJpbXBvcnQge05PVEVTfSBmcm9tICcuL25vdGVfZGF0YSc7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOb3RlR2VuZXJhdG9yIHtcbiAgICAgbm90ZUNvbnRleHQ6IE5vdGVDb250ZXh0O1xuICAgIGNvbnN0cnVjdG9yKG5vdGVDb250ZXh0KSB7XG4gICAgICAgIHRoaXMubm90ZUNvbnRleHQgPSBub3RlQ29udGV4dDtcbiAgICB9XG4gICAgY29tcGlsZShub3RlKSB7XG4gICAgICAgIGxldCBsZW5ndGg6IG51bWJlcjtcbiAgICAgICAgaWYoJ2xlbmd0aCcgaW4gbm90ZSkgbGVuZ3RoID0gbm90ZS5sZW5ndGggKiB0aGlzLm5vdGVDb250ZXh0Lndob2xlTm90ZUxlbmd0aDtcbiAgICAgICAgZWxzZSBsZW5ndGggPSB0aGlzLm5vdGVDb250ZXh0Lndob2xlTm90ZUxlbmd0aDtcbiAgICAgICAgXG4gICAgICAgIGxldCBmcmVxOiBudW1iZXI7XG4gICAgICAgIGlmKCdmcmVxJyBpbiBub3RlKSB7XG4gICAgICAgICAgICBmcmVxID0gbm90ZS5mcmVxO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbGV0IG9jdGF2ZSA9ICdvY3RhdmUnIGluIG5vdGUgPyBub3RlLm9jdGF2ZSA6IDA7XG4gICAgICAgICAgICBvY3RhdmUgKz0gJ29jdGF2ZScgaW4gdGhpcy5ub3RlQ29udGV4dCA/IHRoaXMubm90ZUNvbnRleHQub2N0YXZlIDogMDtcbiAgICAgICAgICAgIGxldCBoYWxmU3RlcHM6IG51bWJlcjtcbiAgICAgICAgICAgIGlmKCdub3RlJyBpbiBub3RlKSB7XG4gICAgICAgICAgICAgICAgaGFsZlN0ZXBzID0gdGhpcy5ub3RlVG9IYWxmU3RlcHMobm90ZS5ub3RlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYoJ2hhbGZTdGVwcycgaW4gbm90ZSkge1xuICAgICAgICAgICAgICAgIGhhbGZTdGVwcyA9IG5vdGUuaGFsZlN0ZXBzO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBoYWxmU3RlcHMgPSAwO1xuICAgICAgICAgICAgZnJlcSA9IHRoaXMuaGFsZlN0ZXBzVG9GcmVxKGhhbGZTdGVwcywgb2N0YXZlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgZnJlcTogZnJlcSxcbiAgICAgICAgICAgIGxlbmd0aDogbGVuZ3RoLFxuICAgICAgICB9XG4gICAgfVxuICAgIG5vdGVUb0hhbGZTdGVwcyhub3RlTmFtZTogc3RyaW5nKSB7XG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBOT1RFUy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYoTk9URVNbaV0uaW5jbHVkZXMobm90ZU5hbWUpKSByZXR1cm4gaTtcbiAgICAgICAgfVxuICAgICAgICBjb25zb2xlLmVycm9yKGBub3RlVG9IYWxmU3RlcHMgZmFpbGVkOiBJbnZhbGlkIG5vdGUgbmFtZTogJHtub3RlTmFtZX1gKTtcbiAgICB9XG4gICAgaGFsZlN0ZXBzVG9GcmVxKGhhbGZTdGVwczogbnVtYmVyLCBvY3RhdmU6IG51bWJlciA9IDApIHtcbiAgICAgICAgcmV0dXJuIE1hdGgucG93KDIsIChoYWxmU3RlcHMgKyAob2N0YXZlICogMTIpKS8xMikgKiB0aGlzLm5vdGVDb250ZXh0LnJvb3RGcmVxO1xuICAgIH1cbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBPc2NpbGxhdG9yIHtcbiAgIGN0eDogQXVkaW9Db250ZXh0O1xuICAgZ2FpbjogR2Fpbk5vZGU7XG4gICBvc2NpbDogT3NjaWxsYXRvck5vZGU7XG5cbiAgIGNvbnN0cnVjdG9yKGN0eCkge1xuICAgICAgdGhpcy5jdHggPSBjdHg7XG4gICAgICB0aGlzLmdhaW4gPSB0aGlzLmN0eC5jcmVhdGVHYWluKCk7XG4gICAgICB0aGlzLm9zY2lsID0gdGhpcy5jdHguY3JlYXRlT3NjaWxsYXRvcigpO1xuICAgICAgdGhpcy5vc2NpbC5jb25uZWN0KHRoaXMuZ2Fpbik7XG4gICAgICB0aGlzLm9zY2lsLnR5cGUgPSBcInNxdWFyZVwiO1xuICAgICAgdGhpcy5nYWluLmNvbm5lY3QodGhpcy5jdHguZGVzdGluYXRpb24pO1xuICAgICAgXG4gICAgICB0aGlzLnNldEdhaW4oMSk7XG4gICAgICBcbiAgIH1cbiAgIHN0b3AoKSB7XG4gICAgICB0aGlzLm9zY2lsLnN0b3AoKTtcbiAgIH1cbiAgIHN0YXJ0KCkge1xuICAgICAgdGhpcy5vc2NpbC5zdGFydCgpO1xuICAgfVxuICAgc2V0RnJlcShmcmVxOiBudW1iZXIsIHN0YXJ0VGltZSA9IDApIHtcbiAgICAgIHRoaXMub3NjaWwuZnJlcXVlbmN5LnNldFZhbHVlQXRUaW1lKGZyZXEsIHRoaXMuY3R4LmN1cnJlbnRUaW1lICsgc3RhcnRUaW1lKTtcbiAgIH1cbiAgIHNldEdhaW4ocGVyY2VudDogbnVtYmVyKSB7XG4gICAgICB0aGlzLmdhaW4uZ2Fpbi5zZXRWYWx1ZUF0VGltZShwZXJjZW50LzEwMCwgdGhpcy5jdHguY3VycmVudFRpbWUpO1xuICAgfVxufSIsImltcG9ydCB7Q0hPUkRTfSBmcm9tICcuL25vdGVfZGF0YSc7XG5cblxuZnVuY3Rpb24gZnJvbUNob3JkKGNob3JkTmFtZSkge1xuICAgIHJldHVybiBDSE9SRFNbY2hvcmROYW1lXS5tYXAoKGhhbGZTdGVwcykgPT4ge1xuICAgICAgICByZXR1cm4ge2hhbGZTdGVwczogaGFsZlN0ZXBzfVxuICAgIH0pO1xufVxuXG5jb25zdCBERUZBVUxUX05PVEVfVkFMVUVTID0ge1xuICAgIG9jdGF2ZTogMCwgXG4gICAgbGVuZ3RoOiAxLFxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQYXR0ZXJuIGV4dGVuZHMgQXJyYXkge1xuICAgIG1pcnJvclBhdHRlcm4oKSB7XG4gICAgICAgIHRoaXMucHVzaCguLi50aGlzLnNsaWNlKDEsIC0xKS5yZXZlcnNlKCkpO1xuICAgIH1cbiAgICBhcHBlbmRPY3RhdmVzKG9jdGF2ZXMpIHtcbiAgICAgICAgZm9yKGxldCBvY3RhdmUgPSAwOyBvY3RhdmUgPCBvY3RhdmVzOyBvY3RhdmUrKykge1xuICAgICAgICAgICAgdGhpcy5wdXNoKHRoaXMuY2hhbmdlT2N0YXZlKG9jdGF2ZSkpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNoYW5nZU9jdGF2ZShvY3RhdmUpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWFwKChub3RlKSA9PiB7XG4gICAgICAgICAgICBsZXQgbmV3Tm90ZSA9IE9iamVjdC5hc3NpZ24oe30sIG5vdGUpO1xuICAgICAgICAgICAgbmV3Tm90ZS5vY3RhdmUgKz0gb2N0YXZlO1xuICAgICAgICAgICAgcmV0dXJuIG5ld05vdGU7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBzd2FwRXZlcnlPdGhlcigpIHtcbiAgICAgICAgZm9yKGxldCBpID0gMDsgaSA8IHRoaXMubGVuZ3RoIC0gMTsgaSsrKSB7XG4gICAgICAgICAgICBbdGhpc1tpXSwgdGhpc1tpKzFdXSA9IFt0aGlzW2krMV0sIHRoaXNbaV1dO1xuICAgICAgICB9XG4gICAgfVxufVxubGV0IHBhdHRlcm4gPSBuZXcgUGF0dGVybigpO1xucGF0dGVybi5wdXNoKHtub3RlOiAnQScsIGxlbmd0aDogNX0sIHtub3RlOiAnQicsIGxlbmd0aDogMn0pO1xuY29uc29sZS5sb2cocGF0dGVybik7XG5jb25zb2xlLmxvZyhwYXR0ZXJuLmNvbnN0cnVjdG9yID09IEFycmF5KTtcbmNvbnNvbGUubG9nKHBhdHRlcm4uY29uc3RydWN0b3IgPT0gUGF0dGVybik7Il0sInNvdXJjZVJvb3QiOiIifQ==