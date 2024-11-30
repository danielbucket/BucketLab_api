import { profileControllerSwitch } from './profileControllerSwitch'

export default function ProfileController(path) {
  const childNode = document.createElement('div')
    childNode.id = 'profileControllerSwitch'
  
  const wrapper = document.createElement('div')
    wrapper.classList.add('controller-wrapper')

  const title = document.createElement('div')
    title.classList.add('title')
    title.innerText = 'Profile Controller'

  const description = document.createElement('p')
    description.classList.add('description')
    description.innerText = 'This is the path@ the Profile Controller.'
  
  const thisPath = document.createElement('p')
  const thisPathText = document.createElement('span')
    thisPathText.innerText = path
    thisPath.innerText = `Path: `
    thisPath.appendChild(thisPathText)

  const button1 = document.createElement('button')
    button1.classList.add('path-btn')
    button1.innerText = '/users_all'
    button1.onclick = () => profileControllerSwitch('/profile/:id')

    wrapper.appendChild(title)
    wrapper.appendChild(description)
    wrapper.appendChild(thisPath)
    wrapper.appendChild(button1)
    wrapper.appendChild(childNode)

  return wrapper
}