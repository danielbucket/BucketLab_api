import { profile_id } from './profile_id.js'

export function profileSwitch(path) {
  const parentNode = document.getElementById('profileRoutes')
  let element

  switch (path) {
    case '/profile:id':
      element = profile_id(path)
      break;
  }

  parentNode.appendChild(element)
}