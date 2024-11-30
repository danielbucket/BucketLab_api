const GET_endpoints = require('./GET_endpoints')
// const POST_endpoints = require('./POST_endpoints') // not yet implemented

export function redirect(path, trace) {
  let element

  switch (path) {
    case '/profile/:id':
      element = GET_endpoints.GET_profileById({
        path,
        trace: trace + '/profile/:id',
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

  const traceText = document.createElement('span')
    traceText.innerText = trace

    pathStack.appendChild(traceText)
    parentNode.appendChild(element)
}