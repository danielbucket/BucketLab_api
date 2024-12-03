import './root.style.css'
import Main from './pages/Main'
import SideBar from './pages/SideBar'

function Root() {
  const mainPage = Main()
  const sideBar = SideBar()
  
  const root = document.createElement('div')
    root.classList.add('root-wrapper')
    root.appendChild(sideBar)
    root.appendChild(mainPage)

  return root
}

document.body.appendChild(Root())