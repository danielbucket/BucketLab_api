import './index.css'
import Header from '../Header'

export default function Main() {
  const header = Header()
  const main = document.createElement('div')
  main.classList.add('main-container')

  const content = document.createElement('div')
  content.classList.add('route-content-container')
  content.id = 'routeContent'

  main.appendChild(header)
  main.appendChild(content)

  return main
}