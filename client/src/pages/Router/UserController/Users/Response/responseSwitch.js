import { GET_all } from './get/GET_all.js'

export function responseSwitch(path) {
  const parentNode = document.getElementsById('responseRoutes')
  let element

  switch(path) {
    case '/get_all':
      element = GET_all(path)
      break
  }

  parentNode.appendChild(element)
}