import './index.style.css'
import ServerRoot from '../ServerRoot'

export default function SideBar() {
  const sideBar = document.createElement('div')
  sideBar.classList.add('sidebar-wrapper')

  const sideBarTitle = document.createElement('div')
  sideBarTitle.innerText = 'BucketLab Server UI'

  sideBar.appendChild(sideBarTitle)
  sideBar.appendChild(ServerRoot())
  
  return sideBar
}