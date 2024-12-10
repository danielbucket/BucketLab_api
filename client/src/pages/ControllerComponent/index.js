import { profileController, userController, phoneController } from '../routesList'
import RouteEndpoint from '../RouteEndpoint'
import './style.css'

function ControllerComponent(object) {
  const container = document.createElement('div')
  container.classList.add('root-routes-container')

  const controller = document.createElement('div')
  controller.classList.add('route-name')
  controller.innerHTML = `
    <p>${object.name}</p>
    <p>${object.route}</p>
    <p>${object.type}</p>
  `

  const body = document.createElement('div')
  body.classList.add('children-wrapper')

  const colNames = document.createElement('div')
  colNames.classList.add('child-element', 'col-names')
  colNames.innerHTML = `
    <p>Name</p>
    <p>Route</p>
    <p>Description</p>
  `
  body.appendChild(colNames)

  object.children.map(child => {
    const el = document.createElement('div')
    el.classList.add('child-element', 'child')
    el.addEventListener('click', (e) => {
      e.preventDefault()
      const activeEls = document.getElementsByClassName('active')
      if (activeEls.length > 0) {
        Array.from(activeEls).map(el => el.classList.remove('active'))
      }
      el.classList.toggle('active')
      handleClick(child)
    })
    el.innerHTML = `
      <p>${child.name}</p>
      <p>${child.route}</p>
      <p>${child.description}</span></p>
    `
    body.appendChild(el)
  })

  container.appendChild(controller)
  container.appendChild(body)

  return container
}

const handleClick = (childObj) => {
  const content = RouteEndpoint(childObj)
  document.getElementById('endpointNameContainer').replaceChildren(content)
}

export const tables = {
  userControllerElement: ControllerComponent(userController),
  profileControllerElement: ControllerComponent(profileController),
  phoneControllerElement: ControllerComponent(phoneController)
}