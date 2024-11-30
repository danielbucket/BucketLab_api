import './index.css'
import { routerSwitch } from "./routerSwitch.js"

export default function Router(path) {
  const childNode = document.createElement('div')
    childNode.id = 'routerSwitch'

  const wrapper = document.createElement('div')
    wrapper.classList.add('route-wrapper')
  
  const title = document.createElement('div')
    title.classList.add('path-title')
    title.innerText = 'Router Path'

  const discription = document.createElement('div')
    discription.classList.add('router-discription')
    discription.innerText = 'This is the path @ the router.'

  const thisPath = document.createElement('div')
    thisPath.classList.add('this-path')
  const thisPathText = document.createElement('span')
    thisPathText.innerText = path
    thisPath.innerText = 'Path: '
    thisPath.appendChild(thisPathText)
  
  const button1 = document.createElement('button')
    button1.classList.add('path-btn')
    button1.innerText = '/user'
    button1.onclick = () => routerSwitch('/user')

  const button2 = document.createElement('button')
    button2.classList.add('path-btn')
    button2.innerText = '/profile'
    button2.onclick = () => routerSwitch('/profile')

    wrapper.appendChild(title)
    wrapper.appendChild(discription)
    wrapper.appendChild(button1)
    wrapper.appendChild(button2)
    wrapper.appendChild(childNode)

  return wrapper
}