export default function Response(path) {
  const wrapper = document.createElement('div')
    wrapper.classList.add('response-wrapper')

  const title = document.createElement('div')
    title.classList.add('response-title')
    title.innerText = 'Response Route Paths'
  
  const description = document.createElement('p')
    description.innerText = 'This is the response route path.'

  const thisPath = document.createElement('p')
  const thisPathText = document.createElement('span')
    thisPathText.innerText = path
    thisPath.innerText = `Path: ${path}`
    thisPath.appendChild(thisPathText)
    

  const button1 = document.createElement('button')
    button1.classList.add('response-btn')
    button1.innerText = '/user'
    button1.onclick = () => responseSwitch('/user')

    wrapper.appendChild(title)
    wrapper.appendChild(thisPath)
    wrapper.appendChild(button)

  return wrapper
}