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

[commander](https://github.com/tj/commander.js/blob/master/Readme_zh-CN.md) 完整的 node.js 命令行解决方案，这个包很重要，cli 的命令行编写就基于它了

clear 清除终端屏幕

chalk 终端字符串样式

cross-spawn spawn 跨平台解决方案，在 Windows 上使用 Spawn 会出现各种问题，所以使用 cross-spawn

[download-git-repo](https://www.npmjs.com/package/download-git-repo) 下载并提取一个 git 存储库（GitHub，GitLab，Bitbucket）。

Figlet 酷炫的文字工具，专门为终端打印好看的文字

ora 优雅的终端旋转器

watch 监视 node.js 中文件树的实用程序

[Handlebars](https://www.npmjs.com/package/handlebars) 模板引擎，专门使用来生成代码时使用的

[open](https://www.npmjs.com/package/open) 打开诸如 URL，文件，可执行文件之类的东西。跨平台

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
