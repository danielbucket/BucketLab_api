import './style.css'
import { tables } from './buildRoutesTables/index.js'

export default function SideBar() {
  const container = document.createElement('div')
    container.classList.add('sidebar-container')

  const pageName = document.createElement('div')
    pageName.classList.add('page-name')
    pageName.innerHTML = '<p>BucketLab Server UI</p>'
    
  const routesContainer = document.createElement('div')
    routesContainer.classList.add('routes-container')
    routesContainer.appendChild(tables.userControllerElement)
    // routesContainer.appendChild(tables.profileControllerElement)
    // routesContainer.appendChild(tables.phoneControllerElement)
    
  container.appendChild(pageName)
  container.appendChild(routesContainer)

  return container
}