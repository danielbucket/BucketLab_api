import Main from './pages/Main'
import './root.style.css'

function Index() {
  const element = document.createElement('div')

  element.appendChild(Main())
}

document.body.appendChild(Index())