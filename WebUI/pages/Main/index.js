export default function Main() {
  const pageContainer = document.createElement('div')
    pageContainer.className = 'app-container'
    
    const header = document.createElement('header')
      header.className = 'page-header'
      header.innerHTML = 'BucketLab Server UI'
    
    const content = document.createElement('div')
      content.className = 'page-content'
      content.innerHTML = 'This is the main page of the BucketLab Server UI'
    
    const footer = document.createElement('footer')
      footer.className = 'page-footer'
    
      const githubLink = document.createElement('a')
        githubLink.href = 'https://github.com/danielbucket/BucketLab_server'
        githubLink.innerHTML = 'GitHub'
      
    footer.appendChild(githubLink)
    
    
  pageContainer.appendChild(header)
  pageContainer.appendChild(content)
  pageContainer.appendChild(footer)
}