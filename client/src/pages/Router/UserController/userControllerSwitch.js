const user_GET_routes = require('./Get')

export function userControllerSwitch(path) {
  const parentNode = document.getElementById('userControllerSwitch')
  let element

  switch (path) {
    case '/users_all':
      element = user_GET_routes.GET_All()
      break
  }

  parentNode.appendChild(element)
}