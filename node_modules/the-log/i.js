require('./src').silent();

console.log('echo');
const a = console.log('one two free');

console.log(a);
console.log(console);

  console.warn('a', 'warn');
  console.count('a', 'count');
  console.count('a', 'count');
  console.group('a', 'group');
  console.debug('a', 'debug');
  console.info('a', 'info');
  console.error('a', 'error');

  console.time('x', 'a');
  console.timeLog('x', 'a', 'timeLog');
  console.timeEnd('x', 'a', 'timeEnd');
