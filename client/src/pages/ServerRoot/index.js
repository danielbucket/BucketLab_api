import './index.style.css'
const PORT = 3000
import { routeSwitch } from '../routes'

export default function ServerRoot() {
  const serverRoot = document.createElement('div')
    serverRoot.classList.add('server-root-wrapper')

  const serverRootTitle = document.createElement('div')
    serverRootTitle.classList.add('server-root-title')
    serverRootTitle.innerText = 'Server Root Paths'

  const serverRouteBtn = document.createElement('button')
    serverRouteBtn.innerText = `https://localhost:${PORT}/api/v1/user`
    serverRouteBtn.onclick = () => routeSwitch('/user')

    const auRouteBtn = document.createElement('button')
    auRouteBtn.innerText = `https://localhost:${PORT}/api/v1/auth`
    // auRouteBtn.onclick = () => {
    //   window.location.hash = '/server-route'
    // }
  
    serverRoot.appendChild(serverRootTitle)
    serverRoot.appendChild(serverRouteBtn)
    serverRoot.appendChild(auRouteBtn)
  
  return serverRoot
}