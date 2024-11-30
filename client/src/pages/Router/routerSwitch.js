import UserController from './UserController'
import ProfileController from './ProfileController'

export function routerSwitch(path) {
  const parentNode = document.getElementById('routerSwitch')
  let element
  
  switch (path) {
    case '/user':
      element = UserController(path)
      break
    case '/profile':
      element = ProfileController(path)
      break
    default:
      return '404'
  }

  parentNode.appendChild(element)
}