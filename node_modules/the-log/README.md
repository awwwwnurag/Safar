# the-log

*The Log is dead. Long live the Log!*

## Instalation

`npm i -S the-log`

## Usage

```javascript
require('the-log');

console.log('echo'); // [2022-02-16T22:06:42.566Z] echo
```

## Suppress logs when running unit tests

```javascript
require('the-log').silent();

describe('Something', () => {
 it('should do something', () => {
   // test code
 });
});
```
