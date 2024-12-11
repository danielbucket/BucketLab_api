import './style.css'
import EndpointData from '../EndpointData'

export default function RouteEndpoint(object) {
  const container = document.createElement('div')
  container.classList.add('endpoints-container')

  const endpointName = document.createElement('div')
  endpointName.classList.add('endpoint-data')
  endpointName.innerHTML = (`
    <div class='endpoint-name'>
      <p>${object.name}</p>
    </div>
    <div class='endpoint-info'>
      <div>
        <p>Route:</p>
        <p>${object.route}</p>
      </div>
      <div>
        <p>Type:</p>
        <p>${object.type}</p>
      </div>
      <div>
        <p>Middeleware:</p>
        <p>${object.middleware}</p>
      </div>
      <div>
        <p>Description:</p>
        <p>${object.description}</p>
      </div>
    </div>
  `)
  
  const childrenRoutes = object.children?.map(child => {
    const el = document.createElement('div')
    el.classList.add('child-container')
    el.addEventListener('click', () => {

      handleClick(child)}
    )
    el.innerHTML = (`
      <div class='child-name'>
        <p>${child.name}</p>
      </div>
    `)
    endpointName.appendChild(el)
  })



  const endpointWrapper = document.createElement('div')
  endpointWrapper.classList.add('endpoint-wrapper')

  container.appendChild(endpointName)
  container.appendChild(endpointWrapper)

  return container
}

const handleClick = (childObj) => {
  const content = EndpointData(childObj)
  document.getElementById('endpointDataContainer').replaceChildren(content)
}