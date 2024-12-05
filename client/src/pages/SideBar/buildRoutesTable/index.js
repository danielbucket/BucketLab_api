import { profileController, userController, phoneController } from '../../routesList'
import './style.css'

const buildRoutesTable = (object) => {
  const table = document.createElement('table')
    table.classList.add('element-container')

  const tHead = document.createElement('caption')
    tHead.classList.add('controller-name')
    tHead.innerHTML = `
      <thead>
          <tr>
            <th scope="col">Controller</th>
            <th scope="col">Route</th>
          </tr>
        </thead>
    `

    const tBody = document.createElement('tbody')
      tBody.classList.add('t-body')

      const tr = document.createElement('tr')
        tr.innerHTML = `
          <td>${object.name}</td>
          <td>${object.route}</td>
        `

    tBody.appendChild(tr)
    tHead.appendChild(tBody)

  table.appendChild(tHead)
  table.appendChild(tBody)

  return table
}

const handleClick = (event) => {
  console.log(event)
}

// I want to use Array.prototype.reduce() to iterate over the object and create a table for each key
const routesTable = controlObj => Object.keys(userController).map(key => {
  const table = document.createElement('table')
    table.classList.add('table-container')

  console.log(controlObj[key])  
})

routesTable(userController)

export const tables = {
  userControllerElement: buildRoutesTable(userController),
//   profileControllerElement: buildRoutesTable(profileController),
//   phoneControllerElement: buildRoutesTable(phoneController),
}