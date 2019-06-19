const baseUrl = process.env.VUE_APP_BASEURL
// const baseUrl = 'http://127.0.0.1:3000'

export default {
  login: `${baseUrl}/users/login`,
  logOut: `${baseUrl}/users/logOut`,
  bugList: `${baseUrl}/bugs/GetBugList`,
  getBugDetail: `${baseUrl}/bugs/GetBugDetail`,
  deleteBug: `${baseUrl}/bugs/DeleteBugById`,
  updateBug: `${baseUrl}/bugs/UpdateBugById`,
  addBug: `${baseUrl}/bugs/AddBugItems`,
  getBugKeywords: `${baseUrl}/bugs/GetAllBugKeywords`,
  addBugKeywords: `${baseUrl}/bugs/AddBugKeywords`,

  blogList: `${baseUrl}/blogs/getBlogList`,
  addEditBlog: `${baseUrl}/blogs/addEditBlog`,
  deleteBlog: `${baseUrl}/blogs/deleteBlog`,
  getBlog: `${baseUrl}/blogs/getBlog`
}
