import Router from '../Router'
import AuthRouter from '../AuthRouter'

export function redirect(path, trace) {
  let element

  switch (path) {
    case '/api/v1':
      element = Router({
        path,
        trace: trace + '/api/v1',
      })
      break
    case '/api/v1/auth':
      element = AuthRouter({
        path,
        trace: path + '/api/v1/auth',
      })
      break
    default:
      return '404'
  }

  const pathStack = document.getElementById('pathStack')
    while(pathStack.firstChild) {
      pathStack.removeChild(pathStack.firstChild)
    }
  const parentNode = document.getElementById('routeContent')
    while (parentNode.firstChild) {
      parentNode.removeChild(parentNode.firstChild)
    }

    pathStack.innerText = trace
    parentNode.appendChild(element)
}