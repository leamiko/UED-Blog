## vue-demo

### 简介

UED BLOG 后台。

### 目录结构

```
├── manageblog                             源码目录   
│   ├── bin                             入口启动文件
│   ├── controller                        	控制层  //写代码逻辑 比如用户方面  创建账号登录注册创建如下user.js
│   │   └── user.js                         user.js
│   ├── logs                                公共组件
│   │   └── errlog                          错误日志
│   │   └── othlog                          其他日志
│   │   └── reqlog                      请求和log日志
│   ├── models                              数据库model层
│   │   └── User                            用户db
│   │         └──db.js                     连接数据库
│   │         └──user.js                      创建表
│   ├── routes                                路由目录
│   │   └── index.js                        路由模块
│   │   └── users.js                        路由模块
│   ├── public                              公共
│   ├── views                               模版
│   ├── app.js                              入口文件
│   ├── log.js                                日志
```

### 全局安装pm2

```bash
# npm若不好用可改用cnpm
npm install -g pm2
```

### 快速开始

```bash
# install dependencies
npm install

# localhost:3000  注意！！！ 每次更改代码需要重启
npm start

# localhost:3000  更改代码无需重启  自动监听
pm2 start bin/www --watch

# 如果通过pm2启动 想要关闭
pm2 stop all
```


