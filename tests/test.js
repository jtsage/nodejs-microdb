MicroDB = require('../microdb.js');

x = new MicroDB({'file':'test.db', 'defaultClean':true});

x.add({ name: 'Harry', age: 10, cows: 4 },'rec1');
x.add({ name: 'Tom',   age: 10, cows: 5 },'rec2');
x.add({ name: 'Jack',  age: 11, cows: 5 },'rec3');
x.add({ name: 'John',  age: 11, cows: 1 },'rec4');

test = {
  'showData': true,
  //'showData': false,
  'sortByKey': true,
  //'sortByKey': false,
  'sortByKeys': true,
  //'sortByKeys': false,
  'find': true,
  //'find': false,
};
if ( test.showData ) {
  console.log('DATA::');
  console.log(x.data);
}

if ( test.sortByKey ) {
  console.log('SORT:: KEY: age, desc');
  console.log(x.sortByKey('age','desc'));
  console.log('SORT:: KEY: name, asc [alpha]');
  console.log(x.sortByKey('name','asc',true));
  console.log('SORT:: KEY: name, desc [alpha]');
  console.log(x.sortByKey('name','desc',true));
  console.log('SORT:: KEY: ducks, asc');
  console.log(x.sortByKey('ducks','asc',true));
}
if ( test.sortByKeys ) {
  console.log('SORT:: KEYS: age,desc; cows,asc');
  console.log(x.sortByKeys([['age','desc'],['cows','asc']]));
  console.log('SORT:: KEYS: age,asc; cows,desc');
  console.log(x.sortByKeys([['age','asc'],['cows','desc']]));
  console.log('SORT:: KEYS: age,asc; name,desc,[alpha]');
  console.log(x.sortByKeys([['age','asc'],['name','desc',true]]));
  console.log('SORT:: KEYS: cows,desc; name,asc,[alpha]');
  console.log(x.sortByKeys([['cows','desc'],['name','asc',true]]));
}
if ( test.find ) {
  console.log('FIND:: age == 10');
  console.log(x.find('age',10));
  console.log('FIND:: name == Tom');
  console.log(x.find('name','Tom'));
  console.log('FIND:: name == Dick');
  console.log(x.find('name','Dick'));
  console.log('FINDALL:: age == 11');
  console.log(x.findAll('age',11));
  console.log('FINDALL:: age == 32');
  console.log(x.findAll('age',32));
}

process.exit();
