const request = require("request");
const fs = require("fs");
const path = require("path");
const mkdirp = require("mkdirp");
const rimraf = require("rimraf");
const chalk = require("chalk");
const ora = require("ora");

const log = (content) => console.log(chalk.green(content));

function netDownload(filePaths) {
  const dir = path.resolve(process.cwd(), "./download_temp");

  rimraf.sync(dir);
  mkdirp.sync(dir);

  log(`${dir}创建成功`);
  const spin = ora(`文件下载...`);
  spin.start();
  const collection = [];
  filePaths.forEach((filePath) => {
    const arr = filePath.split("/");
    const name = arr[arr.length - 1];

    const downloadItem = new Promise((res) => {
      request(filePath, () => {
        res();
      }).pipe(
        fs.createWriteStream(path.resolve(process.cwd(), `${dir}/${name}`))
      );
    });
    collection.push(downloadItem);
  });

  Promise.all(collection).then(() => {
    spin.succeed();
    log("文件下载完成");
  });
}

function readAdressPaths(filePath) {
  const url = path.resolve(process.cwd(), filePath);
  const data = fs.readFileSync(url, { encoding: "utf-8" });

  const pattern =
    /(https?|ftp|file):\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;

  const matchs = data.match(pattern);
  if (Array.isArray(matchs) && matchs.length) {
    netDownload(matchs);
  } else {
    throw Error(`${matchs}不是数组或者为空`);
  }
}

module.exports = function (filePath) {
  try {
    readAdressPaths(filePath);
  } catch (err) {
    console.error(err);
  }
};
