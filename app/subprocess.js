/* Worker process for proving VDFs */

const Sentry = require('@sentry/node');

Sentry.init({ dsn: 'https://b995c76c5330419eb0a5402c4e2bd1f3@sentry.io/1498967' });

const { prove } = require('vdf-solver');

process.on('message', async (m) => {
  const {
    x, t, n, state,
  } = m;

  const start = process.hrtime.bigint();

  const callback = async (s, step, steps) => {
    process.send({
      x,
      t,
      n,
      state: s,
      step,
      steps,
      elapsed: (process.hrtime.bigint() - start).toString(),
    });
    return false;
  };

  const [y, u] = await prove(x, t, n, callback, state);
  if (y && u) {
    process.send({
      x,
      t,
      n,
      y: y.toString(),
      u: u.map(v => v.toString()),
      elapsed: (process.hrtime.bigint() - start).toString(),
    });
  }
});
