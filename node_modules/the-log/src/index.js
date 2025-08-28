(c => {
  const timestamp = () => new Date().toISOString();

  console = {
    ...c,
    log: (...arr) => c.log(`[${timestamp()}]`, ...arr),
    warn: (...arr) => c.warn(`[${timestamp()}]`, ...arr),
    count: (...arr) => c.count(`[${timestamp()}]`, ...arr),
    group: (...arr) => c.group(`[${timestamp()}]`, ...arr),
    debug: (...arr) => c.debug(`[${timestamp()}]`, ...arr),
    info: (...arr) => c.info(`[${timestamp()}]`, ...arr),
    error: (...arr) => c.error(`[${timestamp()}]`, ...arr),
    timeLog: (t, ...arr) => c.timeLog(t, `[${timestamp()}]`, ...arr),
    timeEnd: (t, ...arr) => {
      c.timeLog(t, `[${timestamp()}]`, ...arr);
      c.timeEnd(t, ...arr);
    },
  }

  module.exports = {
    silent: () => {
      console = {
        ...c,
        log: () => {},
        warn: () => {},
        count: () => {},
        group: () => {},
        debug: () => {},
        info: () => {},
        error: () => {},
        timeLog: () => {},
        timeEnd: () => {},
      }
    }
  }

})(console);
