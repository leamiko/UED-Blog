// const baseUrl = process.env.VUE_APP_BASEURL
const baseUrl = 'http://127.0.0.1:3000'

export default {
  login: `${baseUrl}/users/login`,
  logOut: `${baseUrl}/users/logOut`,
  bugList: `${baseUrl}/bugs/GetBugList`,
  deleteBug: `${baseUrl}/bugs/DeleteBugById`,
  updateBug: `${baseUrl}/bugs/UpdateBugById`,
  addBug: `${baseUrl}/bugs/AddBugItems`,

  blogList: `${baseUrl}/blogs/getBlogList`,
  addBlog: `${baseUrl}/blogs/addEditBlog`,
  updateBlog: `${baseUrl}/blogs/addEditBlog`,
<<<<<<< HEAD
  deleteBlog: `${baseUrl}/blogs/deleteBlog`,
  showBlog: `${baseUrl}/blogs/getBlog`,
=======
  deleteBlog: `${baseUrl}/blogs/getBlog`
>>>>>>> 0c358dc6caf177d13f19a520efbbb62e134a407f
}
