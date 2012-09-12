// TINY Database file - *vary* simple storage.
var fs = require('fs');

var MicroData = function(opts) {
  var self = this;
  var defaults = {
    'file': '',
    'savetime': 10, // in min ( 0 = do not autosave )
    'maxrec': 0, // 0 = unlimted (only applies to datatype 0)
    'datatype': 1, // 0 = array, 1 = keyhash
    'flushonexit': true,
    'defaultClean': false
  };
  this.options = defaults;
  if ( typeof opts === 'object' ) {
    for ( var x in opts ) { this.options[x] = opts[x]; }
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
    var retval = [];
    for ( var x in self.data ) {
      if ( key in self.data[x] && self.data[x][key] === value ) {
        retval.push(x);
      }
    }
    return retval;
  }
  
  this.findAllWithKey = function(key) {
    if ( self.options.datatype === 0 ) { return false; }
    var retval = [];
    for ( x in self.data ) {
      if ( key in self.data[x] ) {
        retval.push(x);
      }
    }
    return retval;
  }
  
  this.find = function(key, value) {
    if ( self.options.datatype === 0 ) { return false; }
    for ( var x in self.data ) {
      if ( key in self.data[x] && self.data[x][key] === value ) {
        return x;
      }
    }
    return false;
  }
  
  this.sortByKeys = function(sorts,cleanBad) {
    if ( self.options.datatype === 0 ) { return false; }
    if ( typeof cleanBad === 'undefined' ) { cleanBad = self.options.defaultClean; }
    var sorter = [];
    for ( var x in self.data ) {
      var temp = [x]
      for ( var sort in sorts ) {
        temp.push(self.data[x][sorts[sort][0]]);
      }
      sorter.push(temp);
    }
    if ( sorter.length > 0 ) {
      for ( var x = sorts.length; x > 0; x-- ) {
        if ( typeof sorts[x-1][2] !== 'undefined' && sorts[x-1][2] === true ) {
          if ( sorts[x-1][1] != 'desc' ) {
            sorter = sorter.sort(function(a,b){
              if ( a[x] < b[x] ) return -1;
              if ( a[x] > b[x] ) return 1;
              return 0;
            });
          } else {
            sorter = sorter.sort(function(a,b){
              if ( a[x] > b[x] ) return -1;
              if ( a[x] < b[x] ) return 1;
              return 0;
            });
          }
        } else {
          sorter = sorter.sort(function(a,b) {
            if ( sorts[x-1][1] != 'asc' ) {
              return b[x] - a[x];
            } else {
              return a[x] - b[x];
            }
          });
        }
      }
    }
    if ( cleanBad === false ) { 
      return sorter;
    } else {
      var retSort = [];
      for ( var x = 0; x < sorter.length; x++ ) {
        var keepMe = true;
        for ( var check = 1; check < sorter[x].length; check++ ) {
          if ( typeof sorter[x][check] === 'undefined' ) { keepMe = false; }
        }
        if ( keepMe === true ) { retSort.push(sorter[x]); }
      }
      return retSort;
    }
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
    if ( fs.writeFileSync(self.options.file, JSON.stringify(self.data)) ) {
      return true;
    } else {
      return false;
    }
  }
  
  this.load = function() {
    this.data = JSON.parse(fs.readFileSync(this.options.file).toString());
    console.log(this.options.file + ' Loaded');
  }
  
  if ( fs.existsSync(self.options.file) ) {
    this.load();
  } else {
    this.flush();
  }
  this.startTime();
}

module.exports = MicroData;

