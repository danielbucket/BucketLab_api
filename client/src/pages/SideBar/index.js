import './index.css'
import Server from '../Server'

export default function SideBar() {
  const server = Server({
    path: '/api/v1',
    trace: '/api/v1',
  })

  const wrapper = document.createElement('div')
    wrapper.classList.add('sidebar-wrapper')

  const title = document.createElement('div')
    title.classList.add('sidebar-title')
    title.innerText = 'BucketLab Server UI'

    wrapper.appendChild(title)
    wrapper.appendChild(server)
  
  return wrapper
}