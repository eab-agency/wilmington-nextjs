export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    require('./new-relic-instrumentation.js')
  }
}
