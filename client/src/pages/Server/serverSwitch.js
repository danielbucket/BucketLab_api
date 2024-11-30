import Router from '../Router'
import AuthRouter from '../AuthRouter'

export function serverSwitch(path) {
  const parentNode = document.getElementById('serverRoutes')
  let element

  switch (path) {
    case '/api/v1':
      element = Router(path)
      break
    case '/authRouter':
      element = AuthRouter(path)
      break
    default:
      return '404'
  }

  parentNode.appendChild(element)
}