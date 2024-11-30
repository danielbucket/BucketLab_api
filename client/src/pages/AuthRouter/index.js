import './index.style.css'
// import { authRouterSwitch } from './authRouterSwitch'

export default function AuthRouter() {
  const wrapper = document.createElement('div')
    wrapper.classList.add('auth-router-wrapper')

  const title = document.createElement('div')
    title.classList.add('auth-router-title')
    title.innerText = 'Auth Router Paths'

  const button1 = document.createElement('button')
    button1.innerText = 'https://localhost:3000/api/v1/auth'
    // button1.onclick = () => authRouterSwitch('/auth')

  wrapper.appendChild(title)
  wrapper.appendChild(button1)

  return wrapper
}