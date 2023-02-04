module.exports = {
  require: "./build/tests/hooks.js",
  // 1000 milliseconds = 1 second * 60 = 1 minute * 5 = 5 minutes
  timeout: 1000 * 60 * 5,
};
