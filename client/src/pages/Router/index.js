import './index.css'
import { redirect } from "./redirect.js"

export default function Router({ path, trace }) {
  const wrapper = document.createElement('div')
    wrapper.classList.add('route-wrapper')
  
  const title = document.createElement('p')
    title.classList.add('title')
    title.innerText = 'Router'

  const discription = document.createElement('p')
    discription.classList.add('route-discription')
    discription.innerText = 'Path @ the router.'

  const thisPath = document.createElement('p')
    thisPath.classList.add('this-path')
  const thisPathText = document.createElement('span')
    thisPathText.innerText = path
    thisPath.innerText = 'Path: '
    thisPath.appendChild(thisPathText)

  const content = document.createElement('div')
    content.classList.add('route-content')
    content.appendChild(title)
    content.appendChild(discription)
    content.appendChild(thisPath)
  
  const button1 = document.createElement('button')
    button1.classList.add('path-btn')
    button1.innerText = '/user'
    button1.onclick = () => redirect('/user', trace)

  const button2 = document.createElement('button')
    button2.classList.add('path-btn')
    button2.innerText = '/profile'
    button2.onclick = () => redirect('/profile', trace)

  const btnContainer = document.createElement('div')
    btnContainer.classList.add('btn-container')
    btnContainer.appendChild(button1)
    btnContainer.appendChild(button2)

    wrapper.appendChild(btnContainer)
    wrapper.appendChild(content)

    return wrapper
}