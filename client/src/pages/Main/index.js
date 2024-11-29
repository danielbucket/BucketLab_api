import './index.style.css'

export default function Main() {
  const main = document.createElement('div')
  main.classList.add('main-wrapper')
  main.innerText = 'Router Paths'

  const childRoutes = document.createElement('div')
  childRoutes.classList.add('child-routes')
  childRoutes.id = 'childRoutes'

  main.appendChild(childRoutes)
  return main
}