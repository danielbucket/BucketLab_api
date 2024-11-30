const GET_endpoints = require('./GET_endpoints')
// const POST_endpoints = require('./POST_endpoints') // not yet implemented

export function profileControllerSwitch(path) {
  const parentNode = document.getElementById('profileControllerSwitch')
  let element

  switch (path) {
    case '/profile/:id':
      element = GET_endpoints.GET_profileById(path)
      break
    default: 
      return '404'
  }

  parentNode.appendChild(element)
}