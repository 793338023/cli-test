#!/usr/bin/env node
const program = require("commander");
const init = require("../lib/init");
const shell = require("../lib/shell");
const interactive = require("../lib/interactive");
const download = require("../lib/download");

// 定义版本号
program.version(require("../package").version);

// 子指令1
program
  .command("init <name>")
  .description("初始化项目")
  .option("-d, --debug", "显示debug")
  .action((name, options, command) => {
    init(name);
  });

// 子指令2
// program
//   .command("sh <name>")
//   .description("调用shell")
//   .action((name, options, command) => {
//     shell("aa");
//   });

// 子指令3
// program
//   .command("a <name> [abc]")
//   .description("调用shell")
//   .option("-d, --debug", "显示debug")
//   .action((name, abc, options, command) => {
//     console.log(name, abc, options, command);
//   });

// 子指令4
// program
//   .command("in")
//   .description("终端输入交互效果")
//   .action(() => {
//     interactive();
//   });

// 下载文件子指令
program
  .command("download <path>")
  .alias("d")
  .description("下载文件子指令")
  .action((filePath) => {
    download(filePath);
  });

// 传入参数
program.parse(process.argv);
