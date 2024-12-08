import { profileController, userController, phoneController } from '../../routesList'
import './style.css'

const buildRoutesTables = (object) => {
  const container = document.createElement('div')
  container.classList.add('table-container')

  const controller = document.createElement('div')
  controller.classList.add('controller-name')
  controller.innerHTML = `
    <p>${object.name}</p>
    <p>${object.route}</p>
    <p>${object.description}</p>
  `

  const body = document.createElement('div')
  body.classList.add('children-wrapper')

  object.children.map(child => {
    const el = document.createElement('div')
    el.classList.add('child-element')
    el.addEventListener('click', (e) => {
      e.preventDefault()
      const activeEls = document.getElementsByClassName('active')
      if (activeEls.length > 0) {
        Array.from(activeEls).map(el => {
          el.classList.remove('active')
        })
      }
      el.classList.toggle('active')
      handleClick(child)
    })
    el.innerHTML = `
      <p><span>${child.name}</span></p>
      <p>Route:<span>${child.route}</span></p>
      <p>Description:<span>${child.description}</span></p>
    `

    body.appendChild(el)
  })


  container.appendChild(controller)
  container.appendChild(body)

  return container
}

const handleClick = (childObj) => {
  // console.log(childObj)
}

export const tables = {
  userControllerElement: buildRoutesTables(userController),
  profileControllerElement: buildRoutesTables(profileController),
  phoneControllerElement: buildRoutesTables(phoneController),
}