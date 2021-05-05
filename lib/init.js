const { promisify } = require("util");
const figlet = promisify(require("figlet"));
const clear = require("clear");
const chalk = require("chalk");
const { clone } = require("../utils/download");
const spawn = require("../utils/spawn");
const open = require("open");

const log = (content) => console.log(chalk.green(content));

module.exports = async function (name) {
  clear();
  const figletLog = await figlet("zzc");
  log(figletLog);
  log(`🚀创建项目:` + name);
  await clone("github:793338023/cra-test", name);
  log("安装依赖...");
  await spawn("npm", ["install"], { cwd: `./${name}` });
  log(`
👌安装完成：
To get Start:
===========================
    cd ${name}
    yarn start
===========================
            `);
  await spawn("npm", ["start"], { cwd: `./${name}` });
};
