const logoUrl = require('../img/logo/logo-system-small.svg');
const msgUrl = require('../img/logo/logo-system-message.svg');
const footUrl = require('../img/logo/logo-system-large.svg');
const defaultAva = require('../img/logo/logo-system-avatar.svg');
const banner1 = require('../img/banner/banner-index-banner-1.jpg');
const banner2 = require('../img/banner/banner-index-banner-2.jpg');
const banner3 = require('../img/banner/banner-index-banner-3.jpg');
const banner4 = require('../img/banner/banner-index-banner-4.jpg');
const banner5 = require('../img/banner/banner-index-banner-5.jpg');
const banner6 = require('../img/banner/banner-index-banner-6.jpg');
const banner7 = require('../img/banner/banner-index-banner-7.jpg');
const banner8 = require('../img/banner/banner-index-banner-8.jpg');
const banner9 = require('../img/banner/banner-index-banner-9.jpg');
const banner10 = require('../img/banner/banner-index-banner-10.jpg');
const banner11 = require('../img/banner/banner-index-banner-11.jpg');
const banner12 = require('../img/banner/banner-index-banner-12.jpg');
const banner13 = require('../img/banner/banner-index-banner-13.jpg');
const banner14 = require('../img/banner/banner-index-banner-14.jpg');
const banner15 = require('../img/banner/banner-index-banner-15.jpg');
module.exports = {
  head: {
    title: '瑞见',
    logoUrl: logoUrl,
    msgUrl: msgUrl,
    menu: [
      { label: '首页', redirectUrl: '/' },
      { label: '写字', redirectUrl: '/writing' },
      { label: '打码', redirectUrl: '/coding' },
      { label: '撸图', redirectUrl: '/pointing' },
      { label: '学习', redirectUrl: '/' }
    ],
    slider: [ ]
  },
  foot: {
    logoUrl: footUrl,
    menu: [
      {label: '产品', redirectUrl: '', children: [
        {label: '面试题库', redirectUrl: '/'},
        {label: '产品反馈', redirectUrl: '/'},
        {label: '会议室', redirectUrl: '/'}
      ]},
      {label: '工具', redirectUrl: '', children: [
        {label: '移动端组件库', redirectUrl: '/'},
        {label: '中后台组件库', redirectUrl: '/'}
      ]},
      {label: '关于我们', redirectUrl: '', children: [
        {label: '部门介绍', redirectUrl: '/'},
        {label: '加入我们', redirectUrl: '/'}
      ]},
      {label: '联系我们', redirectUrl: '', children: [
        {label: '中瑞集团', redirectUrl: '/'}
      ]}
    ],
    desc: '©2014 All rights reserved. 青岛中瑞集团 版权所有 法律声明 鲁ICP备14035434号-1'
  },
  search: {
    hotLabel: [
      {name: 'javascript', type: 'info'},
      {name: 'php', type: 'info'},
      {name: 'css', type: 'info'},
      {name: 'html', type: 'info'},
      {name: 'java', type: 'info'},
      {name: 'node.js', type: 'info'},
      {name: 'python', type: 'info'}
    ],
    hotList: [
      {id: '001', name: 'Spring Cloud异步场景分布式事务怎样做？'},
      {id: '002', name: '压测工具如何选择? ab、locust、Jmeter、go压测工具'},
      {id: '003', name: 'Spring Boot启动之前做了哪些事？'},
      {id: '004', name: '小程序手机端数字键盘无法输入小数'},
      {id: '005', name: 'mysql批量插入数据，一次插入多少行数据效率最高？'}
    ],

  },
  index: {
    bannerList: [
      banner1,
      banner2,
      banner3,
      banner4,
      banner5,
      banner6,
      banner7,
      banner8,
      banner9,
      banner10,
      banner11,
      banner12,
      banner13,
      banner14,
      banner15
    ],
    newsList: [
      {
        img: banner8,
        title: 'JavaScript柯里化——柯里化的优缺点有哪些？',
        desc: '柯里化（Currying）是把接受多个参数的函数变换成接受一个单一参数的函数…',
        author: 'UILEO',
        avatar: defaultAva,
        updateTime: '2019-08-28',
        type: '交互',
        likes: 206,
        skim: 6713,
        id: 10000101
      },
      {
        img: banner4,
        title: '学习vue踩过的坑！学习vue踩过的坑！',
        desc: '这篇文章主要记录的是我在写blog前台初次使用Vue时遇到的问题。因为一直…',
        author: 'UILEO',
        avatar: defaultAva,
        updateTime: '2019-08-28',
        type: '交互',
        likes: 206,
        skim: 6713,
        id: 10000102
      },
      {
        img: banner14,
        title: '(译)每个JS开发者应该了解的ES2018新特性',
        desc: '第九版 ECMAScript 提案（简称ES2018或ES9）于2018年6月正式发布。ES…',
        author: 'UILEO',
        avatar: defaultAva,
        updateTime: '2019-08-28',
        type: '交互',
        likes: 206,
        skim: 6713,
        id: 10000103
      },
      {
        img: banner2,
        title: '(译)angular路由完全指南',
        desc: '在本教程中，Ahmed Bouchefra 介绍了angular路由器（router）,以及如何使…',
        author: 'UILEO',
        avatar: defaultAva,
        updateTime: '2019-08-28',
        type: '交互',
        likes: 206,
        skim: 6713,
        id: 10000104
      },
      {
        img: banner5,
        title: 'Vscode入门使用',
        desc: '第九版 ECMAScript 提案（简称ES2018或ES9）于2018年6月正式发布。ES…',
        author: 'UILEO',
        avatar: defaultAva,
        updateTime: '2019-08-28',
        type: '交互',
        likes: 206,
        skim: 6713,
        id: 10000105
      },
      {
        img: banner3,
        title: '“5wh需求分析法”带你正确解读产品背景',
        desc: '浏览器的内核是支持浏览器运行的最核心的程序，分为渲染引擎和 JS 引擎两…',
        author: 'UILEO',
        avatar: defaultAva,
        updateTime: '2019-08-28',
        type: '交互',
        likes: 206,
        skim: 6713,
        id: 10000106
      },
      {
        img: banner7,
        title: '浏览器页面渲染机制',
        desc: '浏览器的内核是支持浏览器运行的最核心的程序，分为渲染引擎和 JS 引擎两部…',
        author: 'UILEO',
        avatar: defaultAva,
        updateTime: '2019-08-28',
        type: '交互',
        likes: 206,
        skim: 6713,
        id: 10000107
      }
    ]
  }
}
