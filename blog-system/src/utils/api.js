const baseUrl = process.env.VUE_APP_BASEURL

export default {
  login: `${baseUrl}/api/login`,
  bugList: `${baseUrl}/bugs/GetBugList`,
  deleteBug: `${baseUrl}/bugs/DeleteBugById`,
  updateBug: `${baseUrl}/bugs/UpdateBugById`,
  addBug: `${baseUrl}/bugs/AddBugItems`
}
