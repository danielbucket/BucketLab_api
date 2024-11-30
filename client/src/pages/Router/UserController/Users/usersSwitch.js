import { getAll } from './resonse/get/GET_all.js'

export function usersSwitch(path) {
  const parentNode = document.getElementById('usersRoutes')
  let element

  switch (path) {
    case '/users_all':
      element = getAll()
      break
  }

  parentNode.appendChild(element)
}