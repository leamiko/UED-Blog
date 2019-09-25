const apiList = [
  {
    code: '1',
    name: '工作台',
    apis: []
  },
  {
    code: '2',
    name: '文章管理',
    apis: [
      '/api/getBlogList',
      '/api/addEditBlog',
      '/api/deleteBlog',
      '/api/getBlog'
    ]
  },
  {
    code: '3',
    name: '缺陷管理',
    apis: [
      '/api/GetBugList',
      '/api/GetBugDetail',
      '/api/DeleteBugById',
      '/api/UpdateBugById',
      '/api/AddBugItems',
      '/api/GetAllBugKeywords',
      '/api/AddBugKeywords'
    ]
  },
  {
    code: '4',
    name: '用户管理',
    apis: ['/api/registerAdmin', '/api/adminList', '/api/deleteAdmin']
  },
  {
    code: '5',
    name: '字典管理',
    apis: [
      '/api/CreateOrEditDictionary',
      '/api/GetDictionaryList',
      '/api/GetDictionaryTree',
      '/api/DeleteDictionaryById'
    ]
  }
]

module.exports = {
  apiList
}
