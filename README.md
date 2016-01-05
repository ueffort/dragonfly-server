## 该项目为监控平台的server组件
> 用于提供web界面进行监控
> 使用restful的资源方式完成数据api层

# 依赖组件
1. consul/etcd:自动服务发现及配置共享
2. redis:消息发送及消息回传

# 环境配置
1. 安装node5.0以上版本
2. npm install 自动安装所需依赖
3. npm run tsd 自动安装typescript所需要的申明文件

# 启动方式
1. npm run init 初始化项目(编译ts文件,编译sass文件,打包前端js文件)
2. npm run start 同时开启所有路由

# 技术范围
> server端
1. node 基于JavaScript的服务端语言,目前也已经支持最新es6的功能
2. typescript 它是JavaScript的一个超集,可以使用静态类型和基于类的面向对象编程,最新的es6也增加了类的概念,可以无缝链接,静态类型的使用可以减少代码部署后的bug
3. express 目前node主流的sever框架,80%以上的node框架都是基于express开发的,因此有很好的技术支持,相关文档也比较全面
4. gulp node自动构建工具 node主流的构建工具有grunt和gulp,gulp相对来说更好的使用了node的异步特性,构建效率上有明显优势,相关构建插件也已经越来越丰富
> web端
1. ejs 模板
2. react 组建化ui
3. webpack 前端资源打包工具
4. sass css扩展工具,引入了一些新的概念如，变量，混合，嵌套和选择器继承。
5. material-ui 基于react和material design的开源组件包
