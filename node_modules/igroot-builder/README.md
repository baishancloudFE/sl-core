# igroot-builder
> iGroot 应用构建器
### 安装
首先确保你已经安装了 [Node.js](http://nodejs.org/) ，然后，请执行以下命令：
``` bash
npm install -g igroot-builder
```
### 使用说明
#### 代码调用
``` javascript
const builder = require('igroot-builder')

// 启动开发环境
builder.run()

// 打包应用
builder.build()
```
#### 命令调用(开发调试用)
命令的执行依赖于当前路径，因此，请在项目根目录中使用
``` bash
# 启动应用
igroot-builder run

# 打包应用
igroot-builder build
```