export default function Main() {
  const main = document.createElement('div')
    main.classList.add('main-container')
    main.style.height = '100%'
    main.style.width = '100%'
    main.style.display = 'flex'
    main.style.flexDirection = 'column'
    main.style.padding = '1rem'
    main.style.borderRight = '.1rem solid var(--faded-black)'
    main.style.borderBottom = '.1rem solid var(--faded-black)'
  
  const endpointNameContainer = document.createElement('div')
    endpointNameContainer.id = 'endpointNameContainer'
    endpointNameContainer.style.height = '25rem'
    
  const endpointDataContainer = document.createElement('div')
    endpointDataContainer.id = 'endpointDataContainer'
    endpointDataContainer.style.flexGrow = '1'

  main.appendChild(endpointNameContainer)
  main.appendChild(endpointDataContainer)

  return main
}