import users from '../UserController/Users'
import profile from './Profile'

export function controllerSwitch(path) {
  const parentNode = document.getElementById('childRoutes')
  let element;

  switch (path) {
    case '/users':
      element = users(path)
      break
    case '/profile':
      element = profile(path)
      break
    default:
      return '404'
  }

  parentNode.appendChild(element)
}