const userController = require('./UserController')
const profileController = require('./ProfileController')

export function routerSwitch(path) {
  const parentNode = document.getElementById('routerSwitch')
  let element
  
  switch (path) {
    case '/user':
      element = userController(path)
      break
    case '/profile':
      element = profileController(path)
      break
    default:
      return '404'
  }

  parentNode.appendChild(element)
}