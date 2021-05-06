const spawn = require("cross-spawn");

module.exports = async function (...args) {
  return new Promise((res) => {
    const process = spawn(...args);
    // process.stdout.pipe(process.stdout);
    // process.stderr.pipe(process.stderr);
    process.on("close", () => {
      res();
    });
  });
};
