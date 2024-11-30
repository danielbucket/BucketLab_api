import './index.css'
import { userControllerSwitch } from './userControllerSwitch.js'

export default function UserController(path) {
  const childNode = document.createElement('div')
    childNode.id = 'userControllerSwitch'

  const wrapper = document.createElement('div')
    wrapper.classList.add('controller-wrapper')

  const title = document.createElement('div')
    title.classList.add('title')
    title.innerText = 'User Controller'

  const description = document.createElement('p')
    description.classList.add('descrition')
    description.innerText = 'This is the path @ the User Controller.'
  
  const thisPath = document.createElement('p')
    thisPath.classList.add('this-path')
  const thisPathText = document.createElement('span')
    thisPathText.innerText = path
    thisPath.innerText = 'Path: '
    thisPath.appendChild(thisPathText)
  
  const button1 = document.createElement('button')
    button1.classList.add('path-btn')
    button1.innerText = '/users_all'
    button1.onclick = () => userControllerSwitch('/users_all')

  wrapper.appendChild(title)
  wrapper.appendChild(description)
  wrapper.appendChild(thisPath)
  wrapper.appendChild(button1)
  wrapper.appendChild(childNode)

  return wrapper
}