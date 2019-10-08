module.exports = {
  head: {
    title: '瑞见',
    logoUrl: '@/assets/img/logo/logo-system-logo.jpg',
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
    logoUrl: '@/assets/img/logo/logo-system-logo.jpg',
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
    ]
  }
}
