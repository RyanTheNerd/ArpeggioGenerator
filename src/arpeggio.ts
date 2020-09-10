class Arpeggio {
   constructor(ctx, pattern, noteConfig) {
      this.ctx = ctx;
      this.pattern = pattern;
      this.oscil = new Oscillator(ctx);
      this.currentNote = 0;
      this.direction = "normal";
      this.alternateDirection = "accending";
      
      this.noteConfig = noteConfig;
      this.noteGenerator = new NoteGenerator(this.noteConfig);
      
      this.playNextNote();
   }
   playNextNote(startTime = null) {
      if(startTime == null) startTime = this.ctx.currentTime;
      
      this.determineNextNote();
      let note = this.noteGenerator.compile(this.pattern[this.currentNote]);
      this.oscil.setFreq(note.freq, startTime);
      let nextTime = this.ctx.currentTime + note.length;
      window.setTimeout(() => {
         this.playNextNote(nextTime); 
      }, (note.length) * 1000 - 100);
   }
   determineNextNote() {
      if(this.direction == "normal") {
         this.currentNote += 1;
         this.currentNote %= this.pattern.length;
      }
      else if(this.direction == "reverse") {
         this.currentNote -= 1;
         if(this.currentNote < 0) this.currentNote = this.pattern.length - 1;
      }
      else if(this.direction == "alternate") {
         if(this.currentNote > this.pattern.length) {
            this.alternateDirection = -1;
         }
         else if(this.currentNote < 0) {
            this.alternateDirection = 1;
         }
         this.currentNote += this.alternateDirection;
      }
      else if(this.direction == "random") {
         let prevNote = this.currentNote;
         while(this.currentNote == prevNote && this.pattern.length > 1) {
            this.currentNote = Math.floor(Math.random() * this.pattern.length);
         }
      }
      else {
         console.error("Invalid direction");
      }
   }
   stop() {
      this.oscil.stop();
   }
}