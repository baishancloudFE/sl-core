# sl
> 前端工程化套件

### 安装
首先确保你已经安装了 [Node.js](http://nodejs.org/) ，然后，请执行以下命令：
> npm install -g sl-core

### 使用说明
命令的执行依赖于当前路径，因此，请在项目根目录中使用
``` bash
# 生成初始项目模板
sl init [name]

##################################################################
# 注意：以下命令的执行依赖于当前路径，因此，请在项目根目录中使用
##################################################################

# 生成页面
sl add -p [name]

# 添加业务组件
sl add -c [name]

# 启动应用
sl dev

# 检测代码
sl lint

# 打包应用
sl build

# 查看当前版本号
sl -v
```