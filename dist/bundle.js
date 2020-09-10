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
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _oscillator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./oscillator */ "./src/oscillator.ts");
/* harmony import */ var _note_generator__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./note_generator */ "./src/note_generator.ts");


var Arpeggio = /** @class */ (function () {
    function Arpeggio(ctx, pattern, noteContext) {
        this.ctx = ctx;
        this.pattern = pattern;
        this.oscil = new _oscillator__WEBPACK_IMPORTED_MODULE_0__["default"](ctx);
        this.currentNote = 0;
        this.direction = "normal";
        this.currentDirection = "accending";
        this.noteContext = noteContext;
        this.noteGenerator = new _note_generator__WEBPACK_IMPORTED_MODULE_1__["default"](this.noteContext);
        this.playNextNote();
    }
    Arpeggio.prototype.playNextNote = function (startTime) {
        var _this = this;
        if (startTime === void 0) { startTime = null; }
        if (startTime == null)
            startTime = this.ctx.currentTime;
        this.determineNextNote();
        var note = this.noteGenerator.compile(this.pattern[this.currentNote]);
        this.oscil.setFreq(note.freq, startTime);
        var nextTime = this.ctx.currentTime + note.length;
        window.setTimeout(function () {
            _this.playNextNote(nextTime);
        }, (note.length) * 1000 - 100);
    };
    Arpeggio.prototype.determineNextNote = function () {
        if (this.direction == "normal") {
            this.currentNote += 1;
            this.currentNote %= this.pattern.length;
        }
        else if (this.direction == "reverse") {
            this.currentNote -= 1;
            if (this.currentNote < 0)
                this.currentNote = this.pattern.length - 1;
        }
        else if (this.direction == "alternate") {
            if (this.currentNote > this.pattern.length) {
                this.currentDirection = "decending";
                this.currentNote -= 1;
            }
            else if (this.currentNote < 0) {
                this.currentDirection = "accending";
                this.currentNote += 1;
            }
        }
        else if (this.direction == "random") {
            var prevNote = this.currentNote;
            while (this.currentNote == prevNote && this.pattern.length > 1) {
                this.currentNote = Math.floor(Math.random() * this.pattern.length);
            }
        }
        else {
            console.error("Invalid direction");
        }
    };
    Arpeggio.prototype.stop = function () {
        this.oscil.stop();
    };
    return Arpeggio;
}());
/* harmony default export */ __webpack_exports__["default"] = (Arpeggio);


/***/ }),

/***/ "./src/arpeggio_generator.ts":
/*!***********************************!*\
  !*** ./src/arpeggio_generator.ts ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _arpeggio__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arpeggio */ "./src/arpeggio.ts");

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
    ArpeggioGenerator.prototype.addArpeggio = function (pattern, noteContext) {
        var fullPattern = [];
        var _loop_1 = function (octave) {
            pattern.forEach(function (note) {
                var newNote = Object.assign({}, note);
                newNote.octave = octave;
                if ('octave' in note)
                    newNote.octave += note.octave;
                fullPattern.push(newNote);
            });
        };
        for (var octave = 0; octave < noteContext.octaves; octave++) {
            _loop_1(octave);
        }
        var arpeggio = new _arpeggio__WEBPACK_IMPORTED_MODULE_0__["default"](this.ctx, fullPattern, noteContext);
        this.arpeggios.push(arpeggio);
        return arpeggio;
    };
    ArpeggioGenerator.prototype.arpeggioFromChord = function (chordName, config) {
        var chord = CHORDS[chordName];
        var order = config.noteOrder || null;
        var pattern = chord.map(function (note, index) {
            if (order)
                return { halfSteps: chord[order[index] - 1] };
            else
                return { halfSteps: note };
        });
        var fullPattern = [];
        return this.addArpeggio(fullPattern, config);
    };
    ArpeggioGenerator.prototype.stop = function () {
        this.arpeggios.forEach(function (a) { return a.stop(); });
    };
    return ArpeggioGenerator;
}());
/* harmony default export */ __webpack_exports__["default"] = (ArpeggioGenerator);


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _arpeggio_generator__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./arpeggio_generator */ "./src/arpeggio_generator.ts");

document.querySelector("#start").onclick = function () {
    var arpeggioGenerator = new _arpeggio_generator__WEBPACK_IMPORTED_MODULE_0__["default"]();
    var arpeggio = arpeggioGenerator.addArpeggio([
        { note: 'C', octave: 1 },
        { note: 'E' },
        { note: 'G', octave: -1 },
    ], {
        direction: "alternate",
        wholeNoteLength: 0.5,
        octaves: 4,
        octave: -2,
        rootFreq: 440
    });
};


/***/ }),

/***/ "./src/note_generator.ts":
/*!*******************************!*\
  !*** ./src/note_generator.ts ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
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
            octave += this.noteContext.octave;
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
        for (var i = 0; i < NOTES.length; i++) {
            if (noteName in NOTES[i])
                return i;
        }
        console.error("noteToHalfSteps failed: Invalid note name");
    };
    NoteGenerator.prototype.halfStepsToFreq = function (halfSteps, octave) {
        return Math.pow(2, (halfSteps + (octave * 12)) / 12) * this.noteContext.rootFreq;
    };
    return NoteGenerator;
}());
/* harmony default export */ __webpack_exports__["default"] = (NoteGenerator);


/***/ }),

/***/ "./src/oscillator.ts":
/*!***************************!*\
  !*** ./src/oscillator.ts ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var Oscillator = /** @class */ (function () {
    function Oscillator(ctx) {
        this.ctx = ctx;
        this.gain = this.ctx.createGain();
        this.oscil = this.ctx.createOscillator();
        this.oscil.connect(this.gain);
        this.gain.connect(this.ctx.destination);
        this.setGain(10);
        this.oscil.start();
    }
    Oscillator.prototype.stop = function () {
        this.oscil.stop();
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
/* harmony default export */ __webpack_exports__["default"] = (Oscillator);


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FycGVnZ2lvLnRzIiwid2VicGFjazovLy8uL3NyYy9hcnBlZ2dpb19nZW5lcmF0b3IudHMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovLy8uL3NyYy9ub3RlX2dlbmVyYXRvci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvb3NjaWxsYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO1FBQUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7OztRQUdBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwwQ0FBMEMsZ0NBQWdDO1FBQzFFO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0Esd0RBQXdELGtCQUFrQjtRQUMxRTtRQUNBLGlEQUFpRCxjQUFjO1FBQy9EOztRQUVBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQSx5Q0FBeUMsaUNBQWlDO1FBQzFFLGdIQUFnSCxtQkFBbUIsRUFBRTtRQUNySTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDJCQUEyQiwwQkFBMEIsRUFBRTtRQUN2RCxpQ0FBaUMsZUFBZTtRQUNoRDtRQUNBO1FBQ0E7O1FBRUE7UUFDQSxzREFBc0QsK0RBQStEOztRQUVySDtRQUNBOzs7UUFHQTtRQUNBOzs7Ozs7Ozs7Ozs7O0FDbEZBO0FBQUE7QUFBQTtBQUFzQztBQUNPO0FBRTdDO0lBU0csa0JBQVksR0FBaUIsRUFBRSxPQUFvQixFQUFFLFdBQXdCO1FBQzFFLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBQ2YsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdkIsSUFBSSxDQUFDLEtB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LENBQUM7UUFDOUIsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUV4QyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBRWpCLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDdEIsQ0FBQztJQUNELHlCQUFJLEdBQUo7UUFDRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFDRCw0QkFBTyxHQUFQLFVBQVEsSUFBWSxFQUFFLFNBQWE7UUFBYix5Q0FBYTtRQUNoQyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsV0FBVyxHQUFHLFNBQVMsQ0FBQyxDQUFDO0lBQy9FLENBQUM7SUFDRCw0QkFBTyxHQUFQLFVBQVEsT0FBZTtRQUNwQixJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsT0FBTyxHQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ3BFLENBQUM7SUFDSixpQkFBQztBQUFELENBQUMiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCJcIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCJpbXBvcnQgT3NjaWxsYXRvciBmcm9tICcuL29zY2lsbGF0b3InO1xuaW1wb3J0IE5vdGVHZW5lcmF0b3IgZnJvbSAnLi9ub3RlX2dlbmVyYXRvcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFycGVnZ2lvIHtcbiAgICBjdHg6IEF1ZGlvQ29udGV4dDtcbiAgICBwYXR0ZXJuOiBBcnJheTxOb3RlPjtcbiAgICBvc2NpbDogT3NjaWxsYXRvcjtcbiAgICBjdXJyZW50Tm90ZTogbnVtYmVyO1xuICAgIGRpcmVjdGlvbjogXCJub3JtYWxcIiB8IFwicmV2ZXJzZVwiIHwgXCJhbHRlcm5hdGVcIiB8IFwicmFuZG9tXCI7XG4gICAgY3VycmVudERpcmVjdGlvbjogXCJhY2NlbmRpbmdcIiB8IFwiZGVjZW5kaW5nXCI7XG4gICAgbm90ZUNvbnRleHQ6IE5vdGVDb250ZXh0O1xuICAgIG5vdGVHZW5lcmF0b3I6IE5vdGVHZW5lcmF0b3I7XG4gICBjb25zdHJ1Y3RvcihjdHg6IEF1ZGlvQ29udGV4dCwgcGF0dGVybjogQXJyYXk8Tm90ZT4sIG5vdGVDb250ZXh0OiBOb3RlQ29udGV4dCkge1xuICAgICAgdGhpcy5jdHggPSBjdHg7XG4gICAgICB0aGlzLnBhdHRlcm4gPSBwYXR0ZXJuO1xuICAgICAgdGhpcy5vc2NpbCA9IG5ldyBPc2NpbGxhdG9yKGN0eCk7XG4gICAgICB0aGlzLmN1cnJlbnROb3RlID0gMDtcbiAgICAgIHRoaXMuZGlyZWN0aW9uID0gXCJub3JtYWxcIjtcbiAgICAgIHRoaXMuY3VycmVudERpcmVjdGlvbj0gXCJhY2NlbmRpbmdcIjtcbiAgICAgIFxuICAgICAgdGhpcy5ub3RlQ29udGV4dCA9IG5vdGVDb250ZXh0O1xuICAgICAgdGhpcy5ub3RlR2VuZXJhdG9yID0gbmV3IE5vdGVHZW5lcmF0b3IodGhpcy5ub3RlQ29udGV4dCk7XG4gICAgICBcbiAgICAgIHRoaXMucGxheU5leHROb3RlKCk7XG4gICB9XG4gICBwbGF5TmV4dE5vdGUoc3RhcnRUaW1lOiBudW1iZXIgPSBudWxsKSB7XG4gICAgICBpZihzdGFydFRpbWUgPT0gbnVsbCkgc3RhcnRUaW1lID0gdGhpcy5jdHguY3VycmVudFRpbWU7XG4gICAgICBcbiAgICAgIHRoaXMuZGV0ZXJtaW5lTmV4dE5vdGUoKTtcbiAgICAgIGxldCBub3RlID0gdGhpcy5ub3RlR2VuZXJhdG9yLmNvbXBpbGUodGhpcy5wYXR0ZXJuW3RoaXMuY3VycmVudE5vdGVdKTtcbiAgICAgIHRoaXMub3NjaWwuc2V0RnJlcShub3RlLmZyZXEsIHN0YXJ0VGltZSk7XG4gICAgICBsZXQgbmV4dFRpbWUgPSB0aGlzLmN0eC5jdXJyZW50VGltZSArIG5vdGUubGVuZ3RoO1xuICAgICAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgdGhpcy5wbGF5TmV4dE5vdGUobmV4dFRpbWUpOyBcbiAgICAgIH0sIChub3RlLmxlbmd0aCkgKiAxMDAwIC0gMTAwKTtcbiAgIH1cbiAgIGRldGVybWluZU5leHROb3RlKCkge1xuICAgICAgaWYodGhpcy5kaXJlY3Rpb24gPT0gXCJub3JtYWxcIikge1xuICAgICAgICAgdGhpcy5jdXJyZW50Tm90ZSArPSAxO1xuICAgICAgICAgdGhpcy5jdXJyZW50Tm90ZSAlPSB0aGlzLnBhdHRlcm4ubGVuZ3RoO1xuICAgICAgfVxuICAgICAgZWxzZSBpZih0aGlzLmRpcmVjdGlvbiA9PSBcInJldmVyc2VcIikge1xuICAgICAgICAgdGhpcy5jdXJyZW50Tm90ZSAtPSAxO1xuICAgICAgICAgaWYodGhpcy5jdXJyZW50Tm90ZSA8IDApIHRoaXMuY3VycmVudE5vdGUgPSB0aGlzLnBhdHRlcm4ubGVuZ3RoIC0gMTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYodGhpcy5kaXJlY3Rpb24gPT0gXCJhbHRlcm5hdGVcIikge1xuICAgICAgICAgaWYodGhpcy5jdXJyZW50Tm90ZSA+IHRoaXMucGF0dGVybi5sZW5ndGgpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudERpcmVjdGlvbiA9IFwiZGVjZW5kaW5nXCI7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnROb3RlIC09IDE7XG4gICAgICAgICB9XG4gICAgICAgICBlbHNlIGlmKHRoaXMuY3VycmVudE5vdGUgPCAwKSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnREaXJlY3Rpb24gPSBcImFjY2VuZGluZ1wiO1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50Tm90ZSArPSAxO1xuICAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSBpZih0aGlzLmRpcmVjdGlvbiA9PSBcInJhbmRvbVwiKSB7XG4gICAgICAgICBsZXQgcHJldk5vdGUgPSB0aGlzLmN1cnJlbnROb3RlO1xuICAgICAgICAgd2hpbGUodGhpcy5jdXJyZW50Tm90ZSA9PSBwcmV2Tm90ZSAmJiB0aGlzLnBhdHRlcm4ubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50Tm90ZSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHRoaXMucGF0dGVybi5sZW5ndGgpO1xuICAgICAgICAgfVxuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgICBjb25zb2xlLmVycm9yKFwiSW52YWxpZCBkaXJlY3Rpb25cIik7XG4gICAgICB9XG4gICB9XG4gICBzdG9wKCkge1xuICAgICAgdGhpcy5vc2NpbC5zdG9wKCk7XG4gICB9XG59IiwiaW1wb3J0IEFycGVnZ2lvIGZyb20gJy4vYXJwZWdnaW8nO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBcnBlZ2dpb0dlbmVyYXRvciB7XG4gICAgY3R4OiBBdWRpb0NvbnRleHQ7XG4gICAgd2hvbGVOb3RlTGVuZ3RoOiBudW1iZXI7XG4gICAgYXJwZWdnaW9zOiBBcnJheTxBcnBlZ2dpbz47XG5cbiAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgdGhpcy5jdHggPSBuZXcgQXVkaW9Db250ZXh0KCk7XG4gICAgICB0aGlzLndob2xlTm90ZUxlbmd0aCA9IDE7XG4gICAgICB0aGlzLmFycGVnZ2lvcyA9IFtdO1xuICAgICAgKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNzdG9wJykgYXMgSFRNTEVsZW1lbnQpLm9uY2xpY2sgPSAoKSA9PiB7XG4gICAgICAgICB0aGlzLnN0b3AoKTtcbiAgICAgIH07XG4gICB9XG4gICBhZGRBcnBlZ2dpbyhwYXR0ZXJuLCBub3RlQ29udGV4dCkge1xuICAgICAgbGV0IGZ1bGxQYXR0ZXJuID0gW107XG4gICAgICBmb3IobGV0IG9jdGF2ZSA9IDA7IG9jdGF2ZSA8IG5vdGVDb250ZXh0Lm9jdGF2ZXM7IG9jdGF2ZSsrKSB7XG4gICAgICAgICBwYXR0ZXJuLmZvckVhY2goKG5vdGUpID0+IHtcbiAgICAgICAgICAgIGxldCBuZXdOb3RlID0gKDxhbnk+T2JqZWN0KS5hc3NpZ24oe30sIG5vdGUpO1xuICAgICAgICAgICAgbmV3Tm90ZS5vY3RhdmUgPSBvY3RhdmU7XG4gICAgICAgICAgICBpZignb2N0YXZlJyBpbiBub3RlKSBuZXdOb3RlLm9jdGF2ZSArPSBub3RlLm9jdGF2ZTtcbiAgICAgICAgICAgIGZ1bGxQYXR0ZXJuLnB1c2gobmV3Tm90ZSk7IFxuICAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBsZXQgYXJwZWdnaW8gPSBuZXcgQXJwZWdnaW8odGhpcy5jdHgsIGZ1bGxQYXR0ZXJuLCBub3RlQ29udGV4dCk7XG4gICAgICB0aGlzLmFycGVnZ2lvcy5wdXNoKGFycGVnZ2lvKTtcbiAgICAgIHJldHVybiBhcnBlZ2dpbztcbiAgIH1cbiAgIGFycGVnZ2lvRnJvbUNob3JkKGNob3JkTmFtZSwgY29uZmlnKSB7XG4gICAgICBsZXQgY2hvcmQgPSBDSE9SRFNbY2hvcmROYW1lXTtcbiAgICAgIGxldCBvcmRlciA9IGNvbmZpZy5ub3RlT3JkZXIgfHwgbnVsbDtcbiAgICAgIGxldCBwYXR0ZXJuID0gY2hvcmQubWFwKChub3RlLCBpbmRleCkgPT4ge1xuICAgICAgICAgaWYob3JkZXIpIHJldHVybiB7aGFsZlN0ZXBzOiBjaG9yZFtvcmRlcltpbmRleF0gLSAxXX07XG4gICAgICAgICBlbHNlIHJldHVybiB7aGFsZlN0ZXBzOiBub3RlfTtcbiAgICAgIH0pO1xuICAgICAgbGV0IGZ1bGxQYXR0ZXJuID0gW107XG4gICAgICByZXR1cm4gdGhpcy5hZGRBcnBlZ2dpbyhmdWxsUGF0dGVybiwgY29uZmlnKTtcbiAgIH1cbiAgIHN0b3AoKSB7XG4gICAgICB0aGlzLmFycGVnZ2lvcy5mb3JFYWNoKChhKSA9PiBhLnN0b3AoKSk7XG4gICB9XG59IiwiaW1wb3J0IEFycGVnZ2lvR2VuZXJhdG9yIGZyb20gJy4vYXJwZWdnaW9fZ2VuZXJhdG9yJztcblxuKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjc3RhcnRcIikgYXMgSFRNTEVsZW1lbnQpLm9uY2xpY2sgPSAoKSA9PiB7XG4gICBsZXQgYXJwZWdnaW9HZW5lcmF0b3IgPSBuZXcgQXJwZWdnaW9HZW5lcmF0b3IoKTtcbiAgIFxuICAgbGV0IGFycGVnZ2lvID0gYXJwZWdnaW9HZW5lcmF0b3IuYWRkQXJwZWdnaW8oW1xuICAgICAge25vdGU6ICdDJywgb2N0YXZlOiAxfSxcbiAgICAgIHtub3RlOiAnRSd9LFxuICAgICAge25vdGU6ICdHJywgb2N0YXZlOiAtMX0sXG4gICBdLCB7XG4gICAgICBkaXJlY3Rpb246IFwiYWx0ZXJuYXRlXCIsXG4gICAgICB3aG9sZU5vdGVMZW5ndGg6IDAuNSxcbiAgICAgIG9jdGF2ZXM6IDQsXG4gICAgICBvY3RhdmU6IC0yLFxuICAgICAgcm9vdEZyZXE6IDQ0MFxuICAgfSk7XG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgTm90ZUdlbmVyYXRvciB7XG4gICAgIG5vdGVDb250ZXh0OiBOb3RlQ29udGV4dDtcbiAgICBjb25zdHJ1Y3Rvcihub3RlQ29udGV4dCkge1xuICAgICAgICB0aGlzLm5vdGVDb250ZXh0ID0gbm90ZUNvbnRleHQ7XG4gICAgfVxuICAgIGNvbXBpbGUobm90ZSkge1xuICAgICAgICBsZXQgbGVuZ3RoOiBudW1iZXI7XG4gICAgICAgIGlmKCdsZW5ndGgnIGluIG5vdGUpIGxlbmd0aCA9IG5vdGUubGVuZ3RoICogdGhpcy5ub3RlQ29udGV4dC53aG9sZU5vdGVMZW5ndGg7XG4gICAgICAgIGVsc2UgbGVuZ3RoID0gdGhpcy5ub3RlQ29udGV4dC53aG9sZU5vdGVMZW5ndGg7XG4gICAgICAgIFxuICAgICAgICBsZXQgZnJlcTogbnVtYmVyO1xuICAgICAgICBpZignZnJlcScgaW4gbm90ZSkge1xuICAgICAgICAgICAgZnJlcSA9IG5vdGUuZnJlcTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGxldCBvY3RhdmUgPSAnb2N0YXZlJyBpbiBub3RlID8gbm90ZS5vY3RhdmUgOiAwO1xuICAgICAgICAgICAgb2N0YXZlICs9IHRoaXMubm90ZUNvbnRleHQub2N0YXZlO1xuICAgICAgICAgICAgbGV0IGhhbGZTdGVwczogbnVtYmVyO1xuICAgICAgICAgICAgaWYoJ25vdGUnIGluIG5vdGUpIHtcbiAgICAgICAgICAgICAgICBoYWxmU3RlcHMgPSB0aGlzLm5vdGVUb0hhbGZTdGVwcyhub3RlLm5vdGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZignaGFsZlN0ZXBzJyBpbiBub3RlKSB7XG4gICAgICAgICAgICAgICAgaGFsZlN0ZXBzID0gbm90ZS5oYWxmU3RlcHM7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGhhbGZTdGVwcyA9IDA7XG4gICAgICAgICAgICBmcmVxID0gdGhpcy5oYWxmU3RlcHNUb0ZyZXEoaGFsZlN0ZXBzLCBvY3RhdmUpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBmcmVxOiBmcmVxLFxuICAgICAgICAgICAgbGVuZ3RoOiBsZW5ndGgsXG4gICAgICAgIH1cbiAgICB9XG4gICAgbm90ZVRvSGFsZlN0ZXBzKG5vdGVOYW1lKSB7XG4gICAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBOT1RFUy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYobm90ZU5hbWUgaW4gTk9URVNbaV0pIHJldHVybiBpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJub3RlVG9IYWxmU3RlcHMgZmFpbGVkOiBJbnZhbGlkIG5vdGUgbmFtZVwiKTtcbiAgICB9XG4gICAgaGFsZlN0ZXBzVG9GcmVxKGhhbGZTdGVwcywgb2N0YXZlKSB7XG4gICAgICAgIHJldHVybiBNYXRoLnBvdygyLCAoaGFsZlN0ZXBzICsgKG9jdGF2ZSAqIDEyKSkvMTIpICogdGhpcy5ub3RlQ29udGV4dC5yb290RnJlcTtcbiAgICB9XG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgT3NjaWxsYXRvciB7XG4gICBjdHg6IEF1ZGlvQ29udGV4dDtcbiAgIGdhaW46IEdhaW5Ob2RlO1xuICAgb3NjaWw6IE9zY2lsbGF0b3JOb2RlO1xuXG4gICBjb25zdHJ1Y3RvcihjdHgpIHtcbiAgICAgIHRoaXMuY3R4ID0gY3R4O1xuICAgICAgdGhpcy5nYWluID0gdGhpcy5jdHguY3JlYXRlR2FpbigpO1xuICAgICAgdGhpcy5vc2NpbCA9IHRoaXMuY3R4LmNyZWF0ZU9zY2lsbGF0b3IoKTtcbiAgICAgIHRoaXMub3NjaWwuY29ubmVjdCh0aGlzLmdhaW4pO1xuICAgICAgdGhpcy5nYWluLmNvbm5lY3QodGhpcy5jdHguZGVzdGluYXRpb24pO1xuICAgICAgXG4gICAgICB0aGlzLnNldEdhaW4oMTApO1xuICAgICAgXG4gICAgICB0aGlzLm9zY2lsLnN0YXJ0KCk7XG4gICB9XG4gICBzdG9wKCkge1xuICAgICAgdGhpcy5vc2NpbC5zdG9wKCk7XG4gICB9XG4gICBzZXRGcmVxKGZyZXE6IG51bWJlciwgc3RhcnRUaW1lID0gMCkge1xuICAgICAgdGhpcy5vc2NpbC5mcmVxdWVuY3kuc2V0VmFsdWVBdFRpbWUoZnJlcSwgdGhpcy5jdHguY3VycmVudFRpbWUgKyBzdGFydFRpbWUpO1xuICAgfVxuICAgc2V0R2FpbihwZXJjZW50OiBudW1iZXIpIHtcbiAgICAgIHRoaXMuZ2Fpbi5nYWluLnNldFZhbHVlQXRUaW1lKHBlcmNlbnQvMTAwLCB0aGlzLmN0eC5jdXJyZW50VGltZSk7XG4gICB9XG59Il0sInNvdXJjZVJvb3QiOiIifQ==