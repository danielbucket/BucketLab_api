const { user } = require('./user')
const { profile } = require('./profile')

export function routeSwitch(path) {
  const parentNode = document.getElementById('childRoutes')
  let element;
  
  switch (path) {
    case '/user':
      element = user()
      break
    case '/profile':
      element = profile()
      break
    default:
      return '404'
  }
        
  console.log(element)
  parentNode.appendChild(element)
}