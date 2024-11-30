import { routerSwitch } from '../routerSwitch.js'

export default function Router(path) {
  const wrapper = document.createElement('div')
    wrapper.classList.add('response-wrapper')

  const title = document.createElement('div')
    title.classList.add('response-title')
    title.innerText = `Route Path: ${path}`

  const description = document.createElement('p')
    description.classList.add('router-descrition')
    description.innerText = 'This is the router path.'
  
  const thisPath = document.createElement('p')
  const thisPathText = document.createElement('span')
    thisPathText.innerText = path
    thisPath.innerText = `Path: `
    thisPath.appendChild(thisPathText)
  
  const button1 = document.createElement('button')
    button1.classList.add('response-btn')
    button1.innerText = '/user'
    button1.onclick = () => routerSwitch('/users')
}