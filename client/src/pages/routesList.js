export const profileController = {
  name: 'Profile',
  route: 'api/v1/profile',
  children: [
    {
      name: 'Get Profile',
      route: '/get',
      children: [
        {
          name: 'Get Profile by ID',
          route: '/:id'
        },
      ]
    },
    {
      name: 'Create Profile',
      route: '/create'
    },
    {
      name: 'Update Profile',
      route: '/update'
    },
    {
      name: 'Delete Profile',
      route: '/delete'
    }
  ]
}

export const userController =  {
  name: 'User',
  route: 'api/v1/user',
  children: [
    {
      name: 'Get User',
      route: '/get',
      children: [
        {
          name: 'Get User by ID',
          route: '/:id'
        },
        {
          name: 'Get User by Email',
          route: '/:email'
        }
      ],
    },
    {
      name: 'Create User',
      route: '/create'
    },
    {
      name: 'Update User',
      route: '/update'
    },
    {
      name: 'Delete User',
      route: '/delete'
    }
  ]
}

export const phoneController = {
  name: 'Phone',
  route: 'api/v1/phone',
  children: [
    {
      name: 'Get Phone',
      route: '/get',
      children: [
        {
          name: 'Get Phone by ID',
          route: '/:id'
        },
        {
          name: 'Get Phone by Number',
          route: '/:number'
        }
      ],
    },
    {
      name: 'Create Phone',
      route: '/create'
    },
    {
      name: 'Update Phone',
      route: '/update'
    },
    {
      name: 'Delete Phone',
      route: '/delete'
    }
  ]
}