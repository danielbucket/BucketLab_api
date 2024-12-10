import './root.style.css'
import SideBar from './pages/SideBar'
import Header from './pages/Header'
import Main from './pages/Main'

function Root() {
  const sideBar = SideBar()
  const header = Header()
  const mainPage = Main()
  
  const root = document.createElement('div')
    root.classList.add('root-wrapper')

    root.appendChild(sideBar)
    root.appendChild(header)
    root.appendChild(mainPage)

  return root
}

document.body.appendChild(Root())