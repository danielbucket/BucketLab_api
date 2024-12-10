import './style.css'

export default function RouteEndpoint(object) {
  const container = document.createElement('div')
  container.classList.add('endpoints-container')

  const controllerName = document.createElement('div')
  controllerName.classList.add('controller-name')
  controllerName.innerHTML = (`
    <p>${object.name}</p>
    <p>${object.route}</p>
    <p>${object.description}</p>
  `)

  const endpointWrapper = document.createElement('div')
  endpointWrapper.classList.add('endpoint-wrapper')

  object.children?.map(child => {
    const el = document.createElement('div')
    el.classList.add('endpoint')
    el.addEventListener('click', (e) => {
      e.preventDefault()
      const activeEls = document.getElementsByClassName('activeEndpoint')
      if (activeEls.length > 0) {
        Array.from(activeEls).map(el => {
          el.classList.remove('activeEndpoint')
        })
      }
      el.classList.toggle('activeEndpoint')
      handleClick(child)
    })
    el.innerHTML = `
      <p>${child.name}</p>
      <p>${child.route}</p>
      <p>${child.description}</p>
      <p>${child.type}</p>
    `
    endpointWrapper.appendChild(el)
  })

  container.appendChild(controllerName)
  container.appendChild(endpointWrapper)

  return container
}

const handleClick = (childObj) => {
  const content = RouteEndpoint(childObj)
  document.getElementById('routeContent').replaceChildren(content)
}