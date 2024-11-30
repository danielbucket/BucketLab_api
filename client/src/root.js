import './root.style.css'
import Main from './pages/Main'
import SideBar from './pages/SideBar'

function Root() {
const root = document.createElement('div')
  root.classList.add('root-wrapper')
  root.appendChild(SideBar())
  root.appendChild(Main())

  return root
}

document.body.appendChild(Root())