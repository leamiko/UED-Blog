const baseUrl = process.env.VUE_APP_BASEURL
// const baseUrl = 'http://127.0.0.1:3002'

export default {
  login: `${baseUrl}/login`,
  logOut: `${baseUrl}/logOut`,
  bugList: `${baseUrl}/GetBugList`,
  getBugDetail: `${baseUrl}/GetBugDetail`,
  deleteBug: `${baseUrl}/DeleteBugById`,
  updateBug: `${baseUrl}/UpdateBugById`,
  addBug: `${baseUrl}/AddBugItems`,
  getBugKeywords: `${baseUrl}/GetAllBugKeywords`,
  addBugKeywords: `${baseUrl}/AddBugKeywords`,

  blogList: `${baseUrl}/getBlogList`,
  addEditBlog: `${baseUrl}/addEditBlog`,
  deleteBlog: `${baseUrl}/deleteBlog`,
  getBlog: `${baseUrl}/getBlog`
}
