export function GET_all_users() {
  const response = document.createElement('div')
    response.classList.add('response-wrapper')

  const responseTitle = document.createElement('div')
    responseTitle.classList.add('response-title')
    responseTitle.innerText = 'GET All Users'

  response.appendChild(responseTitle)

  return response
}