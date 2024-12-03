import './index.css'

export default function Main() {
  const wrapper = document.createElement('div')
    wrapper.classList.add('main-container')
    wrapper.innerText = 'Router Path Map:'

  const routeContent = document.createElement('div')
    routeContent.classList.add('route-content-container')
    routeContent.id = 'routeContent'

    wrapper.appendChild(routeContent)

  return wrapper
}