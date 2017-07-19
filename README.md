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

# 生成组件
sl add -c [name]

# 启动应用
sl dev

# 打包应用
sl build
```

### bsy.json
这是你的项目配置文件，其中有一些非常重要的配置内容。下面是对各项配置内容的介绍：
``` javascript
{
  "name": "",                   // 项目名称
  "type": "project",            // 项目类型
  "builder": "igroot-builder",  // 项目构建器

  "options": {                  // 项目配置
    "homepage": "home",         // 开发环境首页映射
    "port": 8080,               // 开发端口

    "theme": {          // 自定义主题，详细配置参数请查看 iGroot 官网下的主题一栏
      "primary-color": "#1DA57A"
    },

    // 开发环境全局变量
    "dev": {
      // defalut.apiDomail 为默认的 API 请求地址，必须不为空，测试与生产环境下相同
      "default": {"apiDomain": "http://localhost:8080"},

      // 若是在项目中拥有不同的 API 配置，如：端口不同、域名不同，则需要配置额外的变量分组
      "example": {"apiDomain": "http://localhost:8080"},

      // 其余字段可自行扩展，在项目中直接通过 APP_CONFIG 引用，如：
      "key": "value"

      // 上述字段内容在项目中可直接通过 APP_CONFIG.key 获取，测试与生产环境全局变量使用方法相同
    },

    // 测试环境全局变量
    "test": {
      "default": {"apiDomail": "http"}
    },

    // 生产环境全局变量
    "prod": {
      "default": {"apiDomain": "http://localhost:8080"}
    }
  }
}
```

### 目录结构
```
src
  |-- apis                 # API 层
      |-- api.js           # API 声明（所有API声明都在该文件中完成）
      |-- index.js         # 向外提供的 API 调用（外部调用的 API 实例通过该文件获取，开发人员无需关心该文件内容）
      |-- extend           # API 扩展文件夹（API 扩展相关内容请参考API扩展小结）
          |-- ....
  |-- components           # iGroot 业务组件
  |-- pages                # 页面（应用的主体内容，pages 下的每一个文件夹代表一个单页）
  |-- static               # 静态资源（存放图片、字体等静态文件）
  |-- util                   # 通用工具方法
      |-- api.js            # API 对象的基础类
      |-- function.js       # 通用的函数
      |-- http_request.js   # http请求的基础封装库
      |-- transport.js      # GraphQL请求的http层
```

### 关于 API 扩展(extend)的使用说明
> 注：extend 仅针对 RESTful 使用，GraphQL 请略过

#### 使用场景
在我们编写前端代码，调用 API 向后端获取数据时，可能会由于各种各样的原因，导致 **API 所提供的服务无法符合一个统一的标准**，例如这几个场景：
* 由于历史原因，后端提供给我们的 API 可能并不符合 RESTful 规范，例如：
  * 增：POST /someroute/add
  * 改：PUT /someroute/update
  * 查：PUT /someroute

* 对同一资源的单复数操作致使数据格式或 API 不同，例如：
  * 添加单条数据：POST /someroute         {id:xx, data:{/*some thing...*/}}
  * 添加多条数据：POST /someroute/more    [{id:xx, data:{/*some thing...*/}},{id:xx, data:{/*some thing...*/}}]

* 不同 API 之间获取到的数据格式不统一，例如：
  * 获取 A 资源：GET /someroute/a response: 123
  * 获取 B 资源：GET /someroute/b response: {data: {id: 123}}

* ……

不同 API 之间的差异，若是放到业务代码中来处理，就会使得各个业务模块在 API 的调用与处理上存在差异化，十分不利于后期的维护。
因此，框架中抽离出了 API 层来专门处理不同 API 之间的差异，使其在业务层面的调用能够拥有一致的体验。

#### 使用方法
所有 API 存放在 `/src/apis/api.js` 中，其中，API 的基础类提供了部分通用的请求类型，但在上一节描述的场景下，还不能够彻底的满足需求。因此需要**使用 extend 来扩展处理内容，而不是将这段处理逻辑与业务代码耦合**。扩展的使用示例请查看初始化项目中的`/src/apis/api.js`

**总而言之，隔离出 API 层的目的是使其承担`接口转化`与`数据格式转化`的功能，使得业务层调用的 API 与获得的数据能够统一，而扩展的使用，就是实现这个目的的手段。**