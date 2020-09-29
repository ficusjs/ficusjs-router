export const routes = [
  {
    path: '',
    action () {
      return import('../views/home-page.js').then(() => `<home-page></home-page>`)
    }
  },
  {
    path: '/home',
    action () {
      return import('../views/loggedin-page.js').then(() => `<loggedin-page></loggedin-page>`)
    }
  },
  {
    path: '/login',
    action () {
      return import('../views/login-page.js').then(() => `<login-page></login-page>`)
    }
  },
  {
    path: '/one',
    action () {
      return import('../views/page-one.js').then(() => `<page-one></page-one>`)
    }
  },
  {
    path: '/two',
    action () {
      return import('../views/page-two.js').then(() => `<page-two></page-two>`)
    }
  }
]
