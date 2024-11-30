import { routerSwitch } from "./routerSwitch.js"

export default function Router() {
  const wrapper = document.createElement('div')
    wrapper.classList.add('router-wrapper')
  
  const title = document.createElement('div')
    title.classList.add('router-title')
    title.innerText = 'Router Route Paths'

  const discription = document.createElement('div')
    discription.classList.add('router-discription')
    discription.innerText = 'This is the Router Route Paths page. Click on the buttons below to navigate to the respective routes.'
  
  const button1 = document.createElement('button')
    button1.innerText = '/user'
    button1.onclick = () => routerSwitch('/user')

    wrapper.appendChild(title)
    wrapper.appendChild(discription)
    wrapper.appendChild(button1)

  return wrapper
}