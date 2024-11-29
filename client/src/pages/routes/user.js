export function user() {

  const userRoute = document.createElement('div')
    userRoute.classList.add('user-route-wrapper')

  const userRouteTitle = document.createElement('div')
    userRouteTitle.classList.add('user-route-title')
    userRouteTitle.innerText = 'User Route Paths'

  const userRouteBtn1 = document.createElement('button')
    userRouteBtn1.innerText = '/user'
    userRouteBtn1.onclick = () => {
      window.location.hash = '/user'
    }

  const userRouteBtn2 = document.createElement('button')
    userRouteBtn2.innerText = '/user/profile'
    userRouteBtn2.onclick = () => {
      window.location.hash = '/user/profile'
    }

  userRoute.appendChild(userRouteTitle)
  userRoute.appendChild(userRouteBtn1)
  userRoute.appendChild(userRouteBtn2)

  return userRoute
}