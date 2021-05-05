const { promisify } = require("util");
const download = promisify(require("download-git-repo"));
const ora = require("ora");

async function clone(repo, desc) {
  const process = ora(`${desc}下载...`);
  process.start();
  await download(repo, desc);
  process.succeed();
}

module.exports = { clone };
