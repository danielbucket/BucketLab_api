export const profile = () => {
  const profile = document.createElement('div')
    profile.classList.add('profile-wrapper')

  const profileTitle = document.createElement('div')
    profileTitle.classList.add('profile-title')
    profileTitle.innerText = 'Profile Route Paths'

  const profileBtn1 = document.createElement('button')
    profileBtn1.innerText = '/user'
    profileBtn1.onclick = () => {
      window.location.hash = '/user'
    }

  const profileBtn2 = document.createElement('button')
    profileBtn2.innerText = '/user/profile'
    profileBtn2.onclick = () => {
      window.location.hash = '/user/profile'
    }

  profile.appendChild(profileTitle)
  profile.appendChild(profileBtn1)
  profile.appendChild(profileBtn2)

  return profile
}