const request = require("request");
const fs = require("fs");
const path = require("path");
const mkdirp = require("mkdirp");
const rimraf = require("rimraf");
const chalk = require("chalk");
const ora = require("ora");

const pattern = /(.+)/g;
const patternNotes = /##.+/;
const patternURL =
  /((https?|ftp|file):\/\/[-A-Za-z0-9+&@#\/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|])/;

const log = (content) => console.log(chalk.green(content));

function netDownload(fileOpts) {
  const dir = path.resolve(process.cwd(), "./download_temp");

  rimraf.sync(dir);
  mkdirp.sync(dir);

  log(`${dir}创建成功`);
  const spin = ora(`文件下载...`);
  spin.start();
  const collection = [];
  fileOpts.forEach((fileOpt) => {
    const option = fileOpt[1] || {};
    const filePath = fileOpt[0];
    const arr = filePath.split("/");
    let name = option.name || arr[arr.length - 1].split("?")[0];

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

function getMatch(matchs) {
  const nMaths = [];
  let match = "";
  while ((match = matchs.shift())) {
    if (patternURL.test(match)) {
      nMaths.push([match]);
    } else if (patternNotes.test(match)) {
      const currUrl = matchs[0];

      if (patternURL.test(currUrl)) {
        const tempNotes = match.slice(2).trim().split(" ");
        const opts = {};
        tempNotes.forEach((item) => {
          const currItems = item.split("=");
          if (currItems.length === 2) {
            opts[currItems[0]] = currItems[1];
          }
        });

        // 为路径下的配置，弹出这一条
        matchs.shift();
        nMaths.push([currUrl, opts]);
      }
    }
  }

  return nMaths;
}

function readAdressPaths(filePath) {
  const url = path.resolve(process.cwd(), filePath);
  const data = fs.readFileSync(url, { encoding: "utf-8" });

  const matchs = data.match(pattern);
  if (Array.isArray(matchs) && matchs.length) {
    const nMaths = getMatch(matchs);

    netDownload(nMaths);
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
