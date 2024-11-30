import './index.style.css'

export default function Main() {
  const main = document.createElement('div')
    main.classList.add('main-wrapper')
    main.innerText = 'Router Path Map:'

  const serverRoutes = document.createElement('div')
    serverRoutes.classList.add('server-wrapper')
    serverRoutes.id = 'serverRoutes'

    main.appendChild(serverRoutes)

  return main
}