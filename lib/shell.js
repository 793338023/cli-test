const { execFile } = require("child_process");

module.exports = function (name) {
  const process = execFile("../aa.sh");

  process.stdout.pipe(process.stdout);
  process.stderr.pipe(process.stderr);
  process.on("close", () => {
    console.log("sh.");
  });
};
