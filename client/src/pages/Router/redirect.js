import UserController from './UserController'
import ProfileController from './ProfileController'

export function redirect(path, trace) {
  console.log('trace: ', trace)
  let element
  
  switch (path) {
    case '/user':
      element = UserController({
        path,
        trace: trace + '/user'
      })
      break
    case '/profile':
      element = ProfileController({
        path,
        trace: trace + '/profile'
      })
      break
    default:
      return '404'
  }

    const pathStack = document.getElementById('pathStack')
      while (pathStack.firstChild) {
        pathStack.removeChild(pathStack.firstChild)
      }
    const parentNode = document.getElementById('routeContent')
      while (parentNode.firstChild) {
        parentNode.removeChild(parentNode.firstChild)
      }

    pathStack.append.innerHTML = `<div class="path-build">${trace}</div>`
    parentNode.appendChild(element)
}