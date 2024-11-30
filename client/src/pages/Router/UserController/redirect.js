const GET_endpoints = require('./GET_endpoints')
// const POST_endpoints = require('./POST_endpoints') // not yet implemented

export function redirect(path, trace) {
  let element

  switch (path) {
    case '/users_all':
      element = GET_endpoints.GET_all_users({
        path,
        trace: trace + '/users_all',
      })
      break
    default:
      return '404'
  }

  const stackText = document.createElement('span')
    stackText.innerText = trace

  const pathStack = document.getElementById('pathStack')
    while (pathStack.firstChild) {
      pathStack.removeChild(pathStack.firstChild)
    }

  const routeContent = document.getElementById('routeContent')
    while (routeContent.firstChild) {
      routeContent.removeChild(routeContent.firstChild)
    }

    pathStack.appendChild(stackText)
    routeContent.appendChild(element)
}