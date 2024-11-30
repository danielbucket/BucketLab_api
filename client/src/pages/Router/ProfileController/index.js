export default function Controllers(path) {
  const wrapper = document.createElement('div')
    wrapper.classList.add('controllers-wrapper')

  const title = document.createElement('div')
    title.classList.add('controllers-title')
    title.innerText = `Controllers Route Paths`

  const description = document.createElement('p')
    description.classList.add('controllers-description')
    description.innerText = 'This is the controllers route path.'
  
  const thisPath = document.createElement('p')
  const thisPathText = document.createElement('span')
    thisPathText.innerText = path
    thisPath.innerText = `Path: `
    thisPath.appendChild(thisPathText)

  const button = document.createElement('button')
    button.classList.add('controllers-btn')
    button.innerText = '/users_all'
    button.onclick = () => controllersSwitch('/users_all')

    wrapper.appendChild(title)
    wrapper.appendChild(thisPath)
    wrapper.appendChild(button)
  
  return wrapper
}