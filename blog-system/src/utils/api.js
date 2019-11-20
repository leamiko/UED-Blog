const baseUrl = process.env.VUE_APP_BASEURL

export default {
  login: `${baseUrl}/login`,
  logOut: `${baseUrl}/logOut`,

  // 缺陷管理
  bugList: `${baseUrl}/GetBugList`,
  getBugDetail: `${baseUrl}/GetBugDetail`,
  deleteBug: `${baseUrl}/DeleteBugById`,
  updateBug: `${baseUrl}/UpdateBugById`,
  addBug: `${baseUrl}/AddBugItems`,
  getBugKeywords: `${baseUrl}/GetAllBugKeywords`,
  addBugKeywords: `${baseUrl}/AddBugKeywords`,

  // 文章管理
  blogList: `${baseUrl}/getBlogList`,
  addEditBlog: `${baseUrl}/addEditBlog`,
  deleteBlog: `${baseUrl}/deleteBlog`,
  getBlog: `${baseUrl}/getBlog`,
  getUserList: `${baseUrl}/getUserList`,

  // 字典管理
  CreateOrEditDictionary: `${baseUrl}/CreateOrEditDictionary`,
  GetDictionaryList: `${baseUrl}/GetDictionaryList`,
  GetDictionaryTree: `${baseUrl}/GetDictionaryTree`,
  DeleteDictionaryById: `${baseUrl}/DeleteDictionaryById`,

  // 用户管理
  AddAdmin: `${baseUrl}/registerAdmin`,
  adminList: `${baseUrl}/adminList`,
  deleteAdmin: `${baseUrl}/deleteAdmin`,

  // 头像管理
  addAvatar: `${baseUrl}/addAvatar`,
  getAvatarList: `${baseUrl}/getAvatarList`,
  deleteAvatar: `${baseUrl}/deleteAvatar`
}
