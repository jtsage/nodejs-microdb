MicroDB
==========

Purpose
-------
nodejs-microdb is a *tiny* in-process database.  It has very few methods, but
does feature auto-flushing to disk (for file based stores).  It can also be
used in a memory-only mode.  

TOC
---
* [Usage](#usage)
* [Options](#options)
* [API](#api)
* [Status](#status)
* [Contributors](#contrib)
* [Compatibility](#compat)
* [Licence](#lic)

<a name="usage"></a>Usage
-------------------------

    var microdb = require('nodejs-microdb');
    var myDB = new microdb({'file':'somefile.db'});
    
<a name="options"></a>Options
-----------------------------

When making a new database, you have some choices:

    var myDB = new microdb({
      'file': '',     // The filename to save to, or empty for memory only
    
      'savetime': 10, // In minutes, how often to flush to disk (approx)
                      // Set this to 0 to diable auto-save.
    
      'datatype': 0,  // Which data-type:
                      //  0 = Array-based, no keys. (useful for storing lists to disk)
                      //  1 = Object-based, with keys. (what most key/doc's do)
                   
      'maxrec': 10,   // Maximum number of records (for datatype === 0 ONLY)
    
      'flushonexit': true,   // Auto-flush when program quits.
                             // I recommend you leave this on.

      'defalutClean': false, // Auto-remove incomplete records on sort opertaions.
                             // This is useful if your document type isn't consistent.
                             // It can also be turned on per-query.
    });

<a name="api"></a>API
---------------------

### Datatype === 1 Methods:

####MicroData.add(data, \[ident\]); 
Add an item to the store.  If "ident" is not supplied, it will be created.  
Return value is the *"ident"*.

####MicroData.del(ident);
Remove a named "ident" from the store.

####MicroData.find(key, value);
Find a record "ident" by a named key/value pair.  Returns first match, search 
order is arbitrary.

####MicroData.findAll(key, value);
Return an array of record "ident"'s where key === value.  Order is arbitrary.

####MicroData.findAllWithKey(key);
Return an array of record "ident"'s the contain 'key'.  Order is arbitrary.

####MicroData.sortByKey(key, [direction], [alpha], [cleanBad]);
Returns an array of values and "ident"'s, sorted in "direction" (asc/desc).
Set "alpha" to true for alphanumeric sort.  If 'cleanBad' is
true, results with one or more 'undefined' values for the specified keys will
not be returned. NOTE: This is just a convience method to the below...

####MicroData.sortByKeys(sorts, [cleanBad]);
Returns an array of values and "idents"'s sorted by "sorts" array - where sorts
is an array of \[key, direction, alpha\] arrays. (see above).  If 'cleanBad' is
true, results with one or more 'undefined' values for the specified keys will
not be returned.


### Datatype === 0 Methods:

#### MicroData.add(data);
Add an item to the list.

#### MicroData.del(num);
Remove item number 'num' from list.  0-based.

### Shared Methods:

####MicroData.load();
Load file from disk.  Usually called automatically, but if you are before 
options.savetime, it might work as an undo.

####MicroData.save();
Save file to disk.  This is an anonomized asych method (no callback, it'll do it
eventually.  Used internally, I don't recommend it)

####MicroData.flush();
Save file to disk *now*.  Synch method.  If you think you need to flush the db
yourself, chances are this is the method you want.

## <a name="status"></a>Current status
This module is in a development stage. It is broken horribly in places.  There
are quite a few features missing.  And it has zero room for error - this will
always be intended for internal persistent storage, not a real replacement for 
what you should use a real database for.


## <a name="contrib"></a>Contributors
* [J.T. Sage](https://github.com/jtsgae/)

## <a name="compat"></a>Compatibility
This module was only tested using node >= 0.8.8.  There is no reason it shouldn't
run under earlier versions though.

## <a name="lic"></a>Licence
node-ansibuffer is licensed under the MIT license. Or the BSD license.  Or no
license if that's more convient for you.
