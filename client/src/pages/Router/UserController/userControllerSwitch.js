const GET_endpoints = require('./GET_endpoints')
// const POST_endpoints = require('./POST_endpoints') // not yet implemented

export function userControllerSwitch(path) {
  const parentNode = document.getElementById('userControllerSwitch')
  let element

  switch (path) {
    case '/users_all':
      element = GET_endpoints.GET_all_users(path)
      break
    default:
      return '404'
  }

  parentNode.appendChild(element)
}