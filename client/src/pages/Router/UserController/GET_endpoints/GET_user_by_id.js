export function GET_user_by_id(path) {
  const wrapper = document.createElement('div')
    wrapper.classList.add('response-wrapper')

  const title = document.createElement('div')
    title.classList.add('response-title')
    title.innerText = `This is the endpoint GET ${path}`

  wrapper.appendChild(title)

  return wrapper
}