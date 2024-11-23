import styles from './index.css'

function Main() {
  const body = document.getElementById('body')

  const header = document.createElement('header')
    header.className = 'header'
    header.innerHTML = 'BucketLab Server UI'

  const main = document.createElement('main')
    main.className = 'main'
  
  const footer = document.createElement('footer')
    footer.className = 'footer'
    
  const githubLink = document.createElement('a')
    githubLink.href = 'https://github.com/danielbucket/BucketLab_server'
}