import './index.css'
import { redirect } from './redirect.js'
const PORT = 3000

export default function Server({ path, trace }) {
  const wrapper = document.createElement('div')
    wrapper.classList.add('server-root-wrapper')

  const title = document.createElement('div')
    title.innerText = 'Root Routes:'
  
  const titleWrapper = document.createElement('div')
    titleWrapper.classList.add('title-wrapper')
    titleWrapper.appendChild(title)

  const button1 = document.createElement('button')
    button1.innerText = `${path}/api/v1/user`
    button1.onclick = () => redirect('/api/v1', trace)

  const button2 = document.createElement('button')
    button2.innerText = `${path}/api/v1/auth`
    button2.onclick = () => redirect('/api/v1/auth', trace)

  const routesList = document.createElement('ul')
    routesList.classList.add('routes-list')
    routesList.appendChild(button1)
    routesList.appendChild(button2)

    wrapper.appendChild(titleWrapper)
    wrapper.appendChild(routesList)
  
  return wrapper
}