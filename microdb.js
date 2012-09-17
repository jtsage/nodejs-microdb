// TINY Database file - *very* simple storage.
"use strict";
var fs = require('fs');

var MicroData = function(opts) {
  var self = this;
  var defaults = {
    'file': '',
    'savetime': 10,
    'maxrec': 0,
    'datatype': 1,
    'flushonexit': true,
    'defaultClean': false
  };

  this.options = defaults;

  if ( typeof opts === 'object' ) {
    for ( var idx in opts ) { this.options[idx] = opts[idx]; }
  }

  if ( this.options.datatype === 0 ) {
    this.data = [];
  } else {
    this.data = {};
  }

  if ( this.options.flushonexit === true && this.options.file !== '' ) {
    process.on('exit', function () {
      self.flush();
    });
  }

  this.findAll = function(key, value) {
    if ( self.options.datatype === 0 ) { return false; }
    var retArray = [];
    for ( var idx in self.data ) {
      if ( key in self.data[idx] && self.data[idx][key] === value ) {
        retArray.push(idx);
      }
    }
    return retArray;
  }

  this.findAllWithKey = function(key) {
    if ( self.options.datatype === 0 ) { return false; }
    var retArray = [];
    for ( var idx in self.data ) {
      if ( key in self.data[idx] ) {
        retArray.push(idx);
      }
    }
    return retArray;
  }

  this.find = function(key, value) {
    if ( self.options.datatype === 0 ) { return false; }
    for ( var idx in self.data ) {
      if ( key in self.data[idx] && self.data[idx][key] === value ) {
        return idx;
      }
    }
    return false;
  }

  this.sortByKeys = function(sorts,cleanBad) {
    if ( self.options.datatype === 0 ) { return false; }
    if ( typeof cleanBad === 'undefined' ) { cleanBad = self.options.defaultClean; }
    var sorter = [];

    for ( var ident in self.data ) {
      var tempArray = [ident]
      for ( var sort in sorts ) {
        tempArray.push(self.data[ident][sorts[sort][0]]);
      }
      sorter.push(tempArray);
    }

    if ( sorter.length > 0 ) {
      for ( var srtIdx = sorts.length; srtIdx > 0; srtIdx-- ) {
        if ( typeof sorts[srtIdx-1][2] !== 'undefined' && sorts[srtIdx-1][2] === true ) {
          sorter = sorter.sort(function(a,b){
            var multi = ( sorts[srtIdx-1][1] != 'desc' ) ? 1 : -1;
            if ( a[srtIdx] < b[srtIdx] ) return -1*multi;
            if ( a[srtIdx] > b[srtIdx] ) return 1*multi;
            return 0;
          });
        } else {
          sorter = sorter.sort(function(a,b) {
            if ( sorts[srtIdx-1][1] != 'desc' ) {
              return a[srtIdx] - b[srtIdx];
            } else {
              return b[srtIdx] - a[srtIdx];
            }
          });
        }
      }
    }

    if ( cleanBad === false ) { return sorter; }

    var retSort = [];
    for ( var idx = 0; idx < sorter.length; idx++ ) {
      var keepMe = true;
      for ( var check = 1; check < sorter[idx].length; check++ ) {
        if ( typeof sorter[idx][check] === 'undefined' ) { keepMe = false; }
      }
      if ( keepMe === true ) { retSort.push(sorter[idx]); }
    }
    return retSort;
  }

  this.sortByKey = function(key, direction, alpha, cleanBad) {
    return this.sortByKeys([[key,direction,alpha]], cleanBad);
  }

  this.startTime = function() {
    if ( this.options.savetime > 0 ) {
      this.time = setInterval( function() { self.save(); }, this.options.savetime * 1000*60 );
    }
  }

  this.add = function(text, num) {
    if ( typeof num === 'undefined' && this.options.datatype == 1 ) {
      num = new Date().getTime(); 
    }
    if ( this.options.datatype === 0 ) {
      this.data.push(text);
      if ( this.options.maxrec > 0 ) {
        while ( this.data.length > this.options.maxrec ) {
          this.data.shift();
        }
      }
      return this.data.length;
    } else {
      this.data[num] = text;
      return num;
    }
  }

  this.del = function(num) {
    if ( this.options.datatype == 0 ) {
      this.data.splice(num,1);
    } else {
      delete this.data[num];
    }
    return this.data.length;
  }

  this.save = function() {
    if ( this.options.file === '' ) { return true; }
    fs.writeFile(this.options.file, JSON.stringify(this.data), function() { return true; }); 
  }

  this.flush = function() {
    if ( this.options.file === '' ) { return true; }
    fs.writeFileSync(self.options.file, JSON.stringify(self.data));
    return true;
  }

  this.load = function() {
    this.data = JSON.parse(fs.readFileSync(this.options.file).toString());
  }

  if ( fs.existsSync(self.options.file) ) {
    // Load if the file is there
    this.load();
  } else {
    // Otherwise, create it.
    this.flush();
  }
  this.startTime();
}

module.exports = MicroData;

