# my-ued

> My wicked Nuxt.js project

## Build Setup

```bash
# install dependencies
$ npm run install

# serve with hot reload at localhost:3000
$ npm run dev

# 纯开发前端的同学使用如下命令启动项目
$ npm run dev:oneline

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

## 1. 提示

* #### 如本机上存在 `lunz+1.0` 框架的项目，推荐使用 `nvm` 安装最新的 `node.js` 版本，`lunz+1.0` 的框架最佳的 `node.js` 版本为8.2.1。

* #### 如出现更换 `node.js` 的情况，安装完后需要运行 `npm uninstall node-sass` && `npm i node-sass`。

## 2. 目录结构

```bash
├── web-ued                             源码目录
│   ├── .nuxt                               Nuxt自动生成，临时的用于编辑的文件，build
│   ├── assets                              用于组织未编译的静态资源入LESS、SASS 或 JavaScript
│   ├── components                          用于自己编写的Vue组件，比如滚动组件
│   ├── layouts                             布局目录，用于组织应用的布局组件
│   ├── middleware                          用于存放中间件
│   ├── pages                               用于存放写的页面，我们主要的工作区域
│   ├── plugins                             用于存放JavaScript插件的地方
│   ├── static                              用于存放静态资源文件，比如图片
│   ├── store                               用于组织应用的Vuex 状态管理
│   ├── .editorconfig                       开发工具格式配置
│   ├── .eslintrc.js                        ESLint的配置文件，用于检查代码格式
│   ├── .gitignore                          配置git忽略不上传的文件
│   ├── nuxt.config.json                    用于组织Nuxt.js应用的个性化配置，已覆盖默认配置
│   ├── package-lock.json                   npm自动生成，用于帮助package的统一性设置的
│   ├── package.json                        npm包管理配置文件
│   ├── env                                 根据不同的开发环境配置变量，例如API地址、密钥等
│   │   └── .env
│   │   └── .env.dev
│   │   └── .env.prod
```

## 3. 组件

* #### `Scrollbar.vue`

  内容滚动，因个人能力有限无法提取出 `element ui` 中的 `el-scrollbar` 组件出现的代替品。

* #### `Editor.vue`

  富文本组件，集成 `vue-quill-editor` ，可解决 `vue-quill-editor` 在页面中无法设置多个富文本的问题，
  组件可设置 提示语、工具栏选项、主题色（snow）、内容高度，具体的工具栏选项可前往 `@/assets/js/custom.config.js` 中查看。

* #### `Tag.vue`

  标签（label）组件，可传入 text 显示。
