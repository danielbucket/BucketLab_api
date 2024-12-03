import './index.css'
import { userController, profileController } from '../routesList.js'

export default function SideBar() {
  const UserControllerElement = buildRoutesElement(userController)
  const ProfileControllerElement = buildRoutesElement(profileController)

  const container = document.createElement('div')
    container.classList.add('sidebar-container')

  const pageName = document.createElement('div')
    pageName.classList.add('page-name')
    pageName.innerHTML = '<p>BucketLab Server UI</p>'
    
  const routesElement = document.createElement('div')
    routesElement.classList.add('routes-element')
    routesElement.appendChild(UserControllerElement)
    routesElement.appendChild(ProfileControllerElement)
    
  container.appendChild(pageName)
  container.appendChild(routesElement)

  return container
}

const handleClick = (event) => {
  console.log('clicked: ', event.target)
}

const buildRoutesElement = (controller) => {
  const listContainer = document.createElement('div')
    listContainer.classList.add('routes-list-container')

  const routesList = document.createElement('div')
    routesList.classList.add('routes-list')

  const controllerName = document.createElement('div')
    controllerName.classList.add('controller-name')
    controllerName.innerHTML = `
      <p>${controller.name}</p>
      <p>${controller.route}</p>
    `
    routesList.appendChild(controllerName)
    
  controller.children.forEach((child) => {
    const childElement = document.createElement('div')
      childElement.classList.add('route', 'path')
      childElement.innerHTML = `
        <p>${child.name}</p>
        <p>${child.route}</p>
      `
      childElement.addEventListener('click', handleClick)
      routesList.appendChild(childElement)

      if (child.children && child.children.length > 0) {
      console.log('child: ', child.children)
      const childrenList = document.createElement('div')
        childrenList.classList.add('children-list')
      child.children.forEach((grandchild) => {
        const grandchildElement = document.createElement('div')
          grandchildElement.classList.add('route', 'path')
          grandchildElement.innerHTML = `
            <p>${grandchild.name}</p>
            <p>${grandchild.route}</p>
          `
          grandchildElement.addEventListener('click', handleClick)
          childrenList.appendChild(grandchildElement)
      })
      childElement.appendChild(childrenList)
    }
  })


  return listContainer.appendChild(routesList)
}