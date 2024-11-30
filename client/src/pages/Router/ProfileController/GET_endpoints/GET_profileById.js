import './index.css'

export function GET_profileById({ path, trace }) {
  console.log('Path: ', path)
  console.log('Trace: ', trace)
  const childNode = document.createElement('divl')
    childNode.id = 'redirect'
  const div = document.createElement('div')
    div.id = 'profile'
    div.className = 'profile'
    div.innerHTML = `
      <h1>Profile</h1>
      <p>Profile page</p>
    `
  return div
}