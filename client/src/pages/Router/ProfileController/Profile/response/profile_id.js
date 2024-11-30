export function profile_id(path) {
  const profile_id = document.createElement('div')
    profile_id.classList.add('profile-id-wrapper')

  const thisPath = ducument.createElement('p')
    thisPath.classList.add('profile-id-path')
    thisPath.innerText = `${path}`
    
  const profile_id_title = document.createElement('div')
    profile_id_title.classList.add('profile-id-title')
    profile_id_title.innerText = 'Get Profile By ID'

  const description = document.createElement('p')
    description.classList.add('profile-id-description')
    description.innerText = 'This route will return a user profile by ID.'

  profile_id.appendChild(thisPath)
  profile_id.appendChild(profile_id_title)
  profile_id.appendChild(description)

  document.getElementById('profileRoutes').appendChild(profile_id)
}