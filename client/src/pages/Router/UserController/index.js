import './index.css'
import { redirect } from './redirect.js'

export default function UserController({ path, trace }) {
  const wrapper = document.createElement('div')
    wrapper.classList.add('route-wrapper')

  const title = document.createElement('p')
    title.classList.add('title')
    title.innerText = 'User Controller'

  const description = document.createElement('p')
    description.classList.add('route-description')
    description.innerText = 'Path @ the User Controller.'
  
  const thisPath = document.createElement('p')
    thisPath.classList.add('this-path')
  const thisPathText = document.createElement('span')
    thisPathText.innerText = path
    thisPath.innerText = 'Path: '
    thisPath.appendChild(thisPathText)

  const content = document.createElement('div')
    content.classList.add('route-content')
    content.appendChild(title)
    content.appendChild(description)
    content.appendChild(thisPath)
  
  const button1 = document.createElement('button')
    button1.classList.add('path-btn')
    button1.innerText = '/users_all'
    button1.onclick = () => redirect('/users_all', trace)

  const btnContainer = document.createElement('div')
    btnContainer.classList.add('btn-container')
    btnContainer.appendChild(button1)

  wrapper.appendChild(content)
  wrapper.appendChild(btnContainer)

  return wrapper
}