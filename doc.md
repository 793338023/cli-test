# link 与 unlink

npm link 用来在本地项目和本地 npm 模块之间建立连接，可以在本地进行模块测试

首先在目标包上执行`npm link`与全局的`node_modules`创建一个软链接，然后根据`package.json`的`bin`字段，在 npm 文件夹下生成`cmd sh ps1`可以直接使用的全局指令

cmd 是 Window 下使用的
ps1 是 PowerShell 使用的
sh 就是 Shell 脚本

就是为了在不同系统下能执行而生成对应的脚本文件

在执行`npm link`时会根据``package.json`的`dependencies`安装依赖包

Link 成功后提示:

```
C:\Users\Mi\AppData\Roaming\npm\zzc -> C:\Users\Mi\AppData\Roaming\npm\node_modules\zzc\bin\index.js
C:\Users\Mi\AppData\Roaming\npm\node_modules\zzc -> D:\code\zzc

```

link 存在后的提示:

```
npm ERR! path C:\Users\Mi\AppData\Roaming\npm\node_modules\zzc\bin\index.js
npm ERR! dest C:\Users\Mi\AppData\Roaming\npm\zzc.cmd
npm ERR! EEXIST: file already exists, cmd shim 'C:\Users\Mi\AppData\Roaming\npm\node_modules\zzc\bin\index.js' -> 'C:\Users\Mi\AppData\Roaming\npm\zzc.cmd'
npm ERR! File exists: C:\Users\Mi\AppData\Roaming\npm\zzc.cmd
```

unlink 是卸载当前项目上的软链接，因为我们需要先全局 link 后到具体的项目上进行 link

# cli

## 使用到的包

1. [commander](https://github.com/tj/commander.js/blob/master/Readme_zh-CN.md) 完整的 node.js 命令行解决方案，这个包很重要，cli 的命令行编写就基于它了

2. clear 清除终端屏幕

3. chalk 终端字符串样式

4. cross-spawn spawn 跨平台解决方案，在 Windows 上使用 Spawn 会出现各种问题，所以使用 cross-spawn

5. [download-git-repo](https://www.npmjs.com/package/download-git-repo) 下载并提取一个 git 存储库（GitHub，GitLab，Bitbucket）。

6. Figlet 酷炫的文字工具，专门为终端打印好看的文字

7. ora 优雅的终端旋转器

8. watch 监视 node.js 中文件树的实用程序

9. [Handlebars](https://www.npmjs.com/package/handlebars) 模板引擎，专门使用来生成代码时使用的

10. [open](https://www.npmjs.com/package/open) 打开诸如 URL，文件，可执行文件之类的东西。跨平台

11. [Inquirer](https://github.com/SBoudrias/Inquirer.js) 一组通用的交互式命令行用户界面。

## 开始

1. 在 package.json 的 bin 字段定义需要执行的脚本和自定义指令，到时安装时会根据这里定义指令

2. 在入门文件的文件头部定义好使用什么脚本解析器，如 node:

```bash
#!/usr/bin/env node
```

否则在生成脚本执行文件时使用错误脚本解析器执行代码导致无法运行

3. 使用 commander 编写指令

### commander 的使用

编写 cli，核心在与使用 commander，因为 cli 就是一些自定义指令的编写，实现工具，提高效率与减少重复性工作，降低人为的成本

1. 首先使用 version 定义好版本

2. 编写子指令

command 独立的可执行子指令，它有两种方式，一种就是不使用 action，它根据指令与子指令找到当前文件夹底下的可执行文件，一种就是使用 action，在里面进行指令逻辑编写

action 接受参数，前面参数是 command 的定义值，然后才是 options 对象，最后一个是 command 指令对象本身

如[例子的子指令 3](./bin/index.js)

而一个指令的编写需要有描述与选项设置，所以使用到 description 与 option

3. .parse() 和 .parseAsync()

要在指令的最后把需要的参数都传入进去，否则 commander 拿不到参数执行不了子指令，而在头部使用这个 API 也不行，一定要尾部使用

一般都是这样使用

```js
program.parse(process.argv);
```

### spawn

[spawn](http://nodejs.cn/api/child_process.html#child_process_child_process_spawn_command_args_options)衍生子进程，

我们可以在子进程里执行 shell 脚本

如：

```js
spawn("npm", ["install"], { cwd: `./${name}`, stdio: "inherit" });
```

cwd 是子进程的当前工作目录

stdio 子进程的 stdio 配置，在父进程和子进程之间建立的管道

默认是 pipe，如果想把子进程内容都输出，可以配置为 inherit，如上

[具体可以看 stdio](http://nodejs.cn/api/child_process.html#child_process_options_stdio)

执行 shell 文件，可以使用 execFile，如

[例子](./lib/shell.js)

```js
const process = execFile(
  "./aa.sh",
  { cwd: path.resolve(__dirname, "../") },
  (error, stdout, stderr) => {
    console.log(error);
    console.log("stdout:" + stdout);
    console.error("stderr:", stderr);
  }
);
```

mac 报错：Error: spawn EACCES，没有权限，要给文件开启操作权限

```
chmod +x Users/zhang/code/cli-test/aa.sh

chmod +x 文件地址
```

### [download-git-repo](download-git-repo)

拉取 github 或 gitlab 代码

```js
download("github:793338023/cra-test", "cra-test", function (err) {
  console.log(err ? "Error" : "Success");
});
```

第一个参，需要 github:或 gitlab:开头，告诉去哪拉取，然后是项目名称而不是项目地址，在 GitHub 那每个标题就是
第二个参，拉取下来文件夹名称

## 资料

[util.promisify](https://www.jb51.net/article/115967.htm)

[commander](https://github.com/tj/commander.js/blob/master/Readme_zh-CN.md#%E7%8B%AC%E7%AB%8B%E7%9A%84%E5%8F%AF%E6%89%A7%E8%A1%8C%EF%BC%88%E5%AD%90%EF%BC%89%E5%91%BD%E4%BB%A4)

[Inquirer](https://segmentfault.com/a/1190000037629594)

Inquirer在对于终端交互很有用，cli的编写更多是node使用，而且很多都有现成的工具包，善于利用工具，事半功倍

[nodeJs 常用三方工具包](https://mp.weixin.qq.com/s/ALCik37l6wqQI3LJpuAQCQ)

[实现 CLI 常用工具包 - 终端交互相关（问卷、彩色文字、loading、进度条）](https://mp.weixin.qq.com/s?__biz=MzI3ODU4MzQ1MA==&mid=2247490062&idx=1&sn=c2cd161993838fc66bd17082650b60bd&scene=21#wechat_redirect)

## 使用

1. 拉取项目，使用`npm link`，然后执行下`zzc -h`，如果有帮助文档说明成功了
2. 找个目录执行`zzc init demo`，会从 github 上拉取一个项目进行初始化看看效果，具体代码在`bin/index.js`

3. 其他随便玩耍执行或者添加

4. 卸载link，`npm rm --global zzc`

**具体代码可以看项目例子实现**
