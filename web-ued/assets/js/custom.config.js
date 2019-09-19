module.exports = {
  head: {
    title: '瑞见',
    logoUrl: '',
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
    logoUrl: '',
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
  }
}
