import './root.style.css'

function Root() {
  const root = document.createElement('div')
    root.classList.add('root-wrapper')
    root.innerText = 'Welcome to BucketLab Server'

    return root
  }

  document.body.appendChild(Root())