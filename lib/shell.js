const { execFile } = require("child_process");
const path = require("path");

module.exports = function (name) {
  const process = execFile(
    "./aa.sh",
    { cwd: path.resolve(__dirname, "../") },
    (error, stdout, stderr) => {
      console.log(error);
      console.log("stdout:" + stdout);
      console.error("stderr:", stderr);
    }
  );

  // process.stdout.on("data", (data) => {
  //   console.log(data.toString());
  // });

  // process.stderr.on("data", (data) => {
  //   console.error(data.toString());
  // });

  process.on("close", () => {
    console.log("close.");
  });
};
