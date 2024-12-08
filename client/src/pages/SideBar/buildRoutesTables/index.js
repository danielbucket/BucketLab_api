import { profileController, userController, phoneController } from '../../routesList'
import './style.css'

const buildRoutesTables = (object) => {
  const container = document.createElement('div')
    container.classList.add('table-container')

  const controller = document.createElement('div')
    controller.classList.add('controller-name', 'path-layout')
    controller.innerHTML = `
      <p>Controller</p>
      <p>Route</p>
      <p>Description</p>
    `
    const tBody = document.createElement('div')
      tBody.classList.add('t-body')
      
      const routes = document.createElement('div')
        routes.classList.add('path-layout')
        routes.innerHTML = `
          <p>${object.name}</p>
          <p>${object.route}</p>
          <p>${object.description}</p>
        `

        const childrenElementArr = (obj) => {
          return obj.map(child => {
            const el = document.createElement('div')
              el.classList.add('path-layout')
              el.innerHTML = `
                <p>${child.name}</p>
                <p>${child.route}</p>
                <p>${child.description}</p>
              `
            return el
          })
        }

        const children = childrenElementArr(object.children)
        children.forEach(child => tBody.appendChild(child))

    tBody.appendChild(routes)
    controller.appendChild(tBody)

  container.appendChild(controller)
  container.appendChild(tBody)

  return container
}

const handleClick = (event) => {
  console.log(event)
}

export const tables = {
  userControllerElement: buildRoutesTables(userController),
  profileControllerElement: buildRoutesTables(profileController),
  phoneControllerElement: buildRoutesTables(phoneController),
}