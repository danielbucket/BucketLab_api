import './index.style.css'

export default function Main() {
  const main = document.createElement('div')
    main.classList.add('main-wrapper')
    main.innerText = 'This is the Main'

  return main
}