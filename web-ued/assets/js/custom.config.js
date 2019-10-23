module.exports = {
  head: {
    title: '瑞见',
    logoUrl: require('../img/logo/logo-system-small.svg'),
    msgUrl: require('../img/logo/logo-system-message.svg'),
    menu: [
      { label: '首页', redirectUrl: '/' },
      { label: '写字', redirectUrl: '/writing' },
      { label: '打码', redirectUrl: '/coding' },
      { label: '撸图', redirectUrl: '/pointing' },
      { label: '学习', redirectUrl: '/' }
    ],
  },
  foot: {
    logoUrl: require('../img/logo/logo-system-large.svg'),
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
    list: [
      {
        id: 'li000001', name: '开发语言', content: [
          {id: 'ht00001', name: 'javascript', type: 'info'},
          {id: 'ht00002', name: 'php', type: 'info'},
          {id: 'ht00003', name: 'css', type: 'info'},
          {id: 'ht00004', name: 'html', type: 'info'},
          {id: 'ht00005', name: 'java', type: 'info'},
          {id: 'ht00006', name: 'node.js', type: 'info'},
          {id: 'ht00007', name: 'python', type: 'info'}
        ]
      },
      {
        id: 'li000002', name: '平台框架', content: [
          {id: 'ht00001', name: 'KOne应用开发平台', type: 'info'},
          {id: 'ht00002', name: 'Nexaweb', type: 'info'},
          {id: 'ht00003', name: 'JBoss Seam', type: 'info'},
          {id: 'ht00004', name: 'Dorado', type: 'info'},
          {id: 'ht00005', name: 'Jdon Framework', type: 'info'},
          {id: 'ht00006', name: 'Python Web 开发框架', type: 'info'}
        ]
      },
      {
        id: 'li000003', name: '服务器', content: [
          {id: 'ht00001', name: '腾讯云服务器', type: 'info'},
          {id: 'ht00002', name: '七牛云服务器', type: 'info'},
          {id: 'ht00003', name: '阿里云服务器', type: 'info'},
          {id: 'ht00004', name: '华为云服务器', type: 'info'},
          {id: 'ht00005', name: '浪潮服务器', type: 'info'}
        ]
      },
      {
        id: 'li000004', name: '数据库与缓存', content: [
          {id: 'ht00001', name: 'MySql', type: 'info'},
          {id: 'ht00002', name: 'MsSqlserver', type: 'info'},
          {id: 'ht00003', name: 'Oracle', type: 'info'},
          {id: 'ht00004', name: 'Sybase', type: 'info'},
          {id: 'ht00005', name: 'DB2', type: 'info'}
        ]
      },
      {
        id: 'li000005', name: '开发工具', content: [
          {id: 'ht00001', name: 'Java', type: 'info'},
          {id: 'ht00002', name: 'C++', type: 'info'},
          {id: 'ht00003', name: 'C#', type: 'info'},
          {id: 'ht00004', name: 'VB', type: 'info'},
          {id: 'ht00005', name: 'JSP', type: 'info'},
          {id: 'ht00006', name: 'PHP', type: 'info'},
          {id: 'ht00007', name: 'Web App', type: 'info'}
        ]
      },
      {
        id: 'li000008', name: '系统设备', content: [
          {id: 'ht00001', name: '控制器', type: 'info'},
          {id: 'ht00002', name: '运算器', type: 'info'},
          {id: 'ht00003', name: 'I/O设备', type: 'info'},
          {id: 'ht00004', name: '硬件系统', type: 'info'},
          {id: 'ht00005', name: '软件系统', type: 'info'}
        ]
      },
      {
        id: 'li000009', name: '其他', content: [
          {id: 'ht00001', name: '广场舞', type: 'info'},
          {id: 'ht00002', name: '明星', type: 'info'},
          {id: 'ht00007', name: '天气', type: 'info'}
        ]
      }
    ],
    hotLabel: [
      {id: 'ht00001', name: 'javascript', type: 'info'},
      {id: 'ht00002', name: 'php', type: 'info'},
      {id: 'ht00003', name: 'css', type: 'info'},
      {id: 'ht00004', name: 'html', type: 'info'},
      {id: 'ht00005', name: 'java', type: 'info'},
      {id: 'ht00006', name: 'node.js', type: 'info'},
      {id: 'ht00007', name: 'python', type: 'info'}
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
    swipers: [
      require('../img/banner/banner-index-banner-1.jpg'),
      require('../img/banner/banner-index-banner-2.jpg'),
      require('../img/banner/banner-index-banner-3.jpg'),
      require('../img/banner/banner-index-banner-4.jpg'),
      require('../img/banner/banner-index-banner-5.jpg'),
      require('../img/banner/banner-index-banner-6.jpg'),
      require('../img/banner/banner-index-banner-7.jpg'),
      require('../img/banner/banner-index-banner-8.jpg'),
      require('../img/banner/banner-index-banner-9.jpg'),
      require('../img/banner/banner-index-banner-10.jpg'),
      require('../img/banner/banner-index-banner-11.jpg'),
      require('../img/banner/banner-index-banner-12.jpg'),
      require('../img/banner/banner-index-banner-13.jpg'),
      require('../img/banner/banner-index-banner-14.jpg'),
      require('../img/banner/banner-index-banner-15.jpg')
    ],
    newsList: [
      {
        img: require('../img/banner/banner-index-banner-8.jpg'),
        title: 'JavaScript柯里化——柯里化的优缺点有哪些？',
        desc: '柯里化（Currying）是把接受多个参数的函数变换成接受一个单一参数的函数…',
        author: 'UILEO',
        avatar: require('../img/logo/logo-system-avatar.svg'),
        updateTime: '2019-08-28',
        type: '交互',
        likes: 206,
        skim: 6713,
        id: 10000101
      },
      {
        img: require('../img/banner/banner-index-banner-4.jpg'),
        title: '学习vue踩过的坑！学习vue踩过的坑！',
        desc: '这篇文章主要记录的是我在写blog前台初次使用Vue时遇到的问题。因为一直…',
        author: 'UILEO',
        avatar: require('../img/logo/logo-system-avatar.svg'),
        updateTime: '2019-08-28',
        type: '交互',
        likes: 206,
        skim: 6713,
        id: 10000102
      },
      {
        img: require('../img/banner/banner-index-banner-14.jpg'),
        title: '(译)每个JS开发者应该了解的ES2018新特性',
        desc: '第九版 ECMAScript 提案（简称ES2018或ES9）于2018年6月正式发布。ES…',
        author: 'UILEO',
        avatar: require('../img/logo/logo-system-avatar.svg'),
        updateTime: '2019-08-28',
        type: '交互',
        likes: 206,
        skim: 6713,
        id: 10000103
      },
      {
        img: require('../img/banner/banner-index-banner-2.jpg'),
        title: '(译)angular路由完全指南',
        desc: '在本教程中，Ahmed Bouchefra 介绍了angular路由器（router）,以及如何使…',
        author: 'UILEO',
        avatar: require('../img/logo/logo-system-avatar.svg'),
        updateTime: '2019-08-28',
        type: '交互',
        likes: 206,
        skim: 6713,
        id: 10000104
      },
      {
        img: require('../img/banner/banner-index-banner-5.jpg'),
        title: 'Vscode入门使用',
        desc: '第九版 ECMAScript 提案（简称ES2018或ES9）于2018年6月正式发布。ES…',
        author: 'UILEO',
        avatar: require('../img/logo/logo-system-avatar.svg'),
        updateTime: '2019-08-28',
        type: '交互',
        likes: 206,
        skim: 6713,
        id: 10000105
      },
      {
        img: require('../img/banner/banner-index-banner-3.jpg'),
        title: '“5wh需求分析法”带你正确解读产品背景',
        desc: '浏览器的内核是支持浏览器运行的最核心的程序，分为渲染引擎和 JS 引擎两…',
        author: 'UILEO',
        avatar: require('../img/logo/logo-system-avatar.svg'),
        updateTime: '2019-08-28',
        type: '交互',
        likes: 206,
        skim: 6713,
        id: 10000106
      },
      {
        img: require('../img/banner/banner-index-banner-7.jpg'),
        title: '浏览器页面渲染机制',
        desc: '浏览器的内核是支持浏览器运行的最核心的程序，分为渲染引擎和 JS 引擎两部…',
        author: 'UILEO',
        avatar: require('../img/logo/logo-system-avatar.svg'),
        updateTime: '2019-08-28',
        type: '交互',
        likes: 206,
        skim: 6713,
        id: 10000107
      }
    ]
  },
  editorOption: {
    placeholder: '请在这里输入',
    modules:{
      toolbar:[
        ['bold', 'italic'], ['image'], ['link', 'code-block'], [{ 'list': 'bullet'}, { 'list': 'ordered' }], ['blockquote']
        // ['bold', 'italic', 'underline', 'strike'],    //加粗，斜体，下划线，删除线
        // ['blockquote', 'code-block', 'link'],     //引用，代码块, 超链接

        // [{ 'header': 1 }, { 'header': 2 }],        // 标题，键值对的形式；1、2表示字体大小
        // [{ 'list': 'ordered'}, { 'list': 'bullet' }],     //列表
        // [{ 'script': 'sub'}, { 'script': 'super' }],   // 上下标
        // [{ 'indent': '-1'}, { 'indent': '+1' }],     // 缩进
        // [{ 'direction': 'rtl' }],             // 文本方向

        // // [{ 'size': ['small', false, 'large', 'huge'] }], // 字体大小
        // // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],     //几级标题

        // [{ 'color': [] }, { 'background': [] }],     // 字体颜色，字体背景颜色
        // [{ 'font': [] }],     //字体
        // [{ 'align': [] }],    //对齐方式

        // ['clean'],    //清除字体样式
        // ['image','video']    //上传图片、上传视频
      ]
    },
    theme: 'snow'
  },
  write: {
    swiperList:[
      require('../img/banner/write_swiper_1.png'),
      require('../img/banner/banner-index-banner-1.jpg'),
      require('../img/banner/banner-index-banner-2.jpg')
    ]
  }
}
