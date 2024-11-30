import './index.css'

export default function Main() {
  const wrapper = document.createElement('div')
    wrapper.classList.add('main-container')
    wrapper.innerText = 'Router Path Map:'

  const stackContainer = document.createElement('div')

  const pathStack = document.createElement('p')
    pathStack.classList.add('path-stack')
    pathStack.id = 'pathStack'
    pathStack.innerText = 'Path Stack: '
    
  const stackText = document.createElement('span')
    stackText.id = 'stackText'

    pathStack.appendChild(stackText)
    stackContainer.appendChild(pathStack)

  const routeContent = document.createElement('div')
    routeContent.classList.add('route-content-container')
    routeContent.id = 'routeContent'

    wrapper.appendChild(stackContainer)
    wrapper.appendChild(routeContent)

  return wrapper
}