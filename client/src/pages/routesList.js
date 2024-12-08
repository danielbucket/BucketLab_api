export const profileController = {
  name: 'Profile',
  route: 'api/v1/profile',
  description: 'Profile controller root.',
  children: [
    {
      name: 'Get Profile',
      route: '/get',
      description: 'Get Profile',
      children: [
        {
          name: 'Get Profile by ID',
          route: '/:id',
          description: 'Get Profile by ID'
        },
      ]
    },
    {
      name: 'Create Profile',
      route: '/create',
      description: 'Create Profile'
    },
    {
      name: 'Update Profile',
      route: '/update',
      description: 'Update Profile'
    },
    {
      name: 'Delete Profile',
      route: '/delete',
      description: 'Delete Profile'
    }
  ]
}

export const userController =  {
  name: 'User',
  route: 'api/v1/user',
  description: 'User controller root.',
  children: [
    {
      name: 'Get User',
      route: '/get',
      description: 'Get user information. Used at user login.',
      children: [
        {
          name: 'Get User by ID',
          route: '/:id',
          description: 'Get User by ID'
        },
        {
          name: 'Get User by Email',
          route: '/:email',
          description: 'Get the user data using the asscoiated email address.'
        }
      ],
    },
    {
      name: 'Create User',
      route: '/create',
      description: 'Create User'
    },
    {
      name: 'Update User',
      route: '/update',
      description: 'Update User'
    },
    {
      name: 'Delete User',
      route: '/delete',
      description: 'Delete User'
    }
  ]
}

export const phoneController = {
  name: 'Phone',
  route: 'api/v1/phone',
  description: 'Phone controller root.',
  children: [
    {
      name: 'Get Phone',
      route: '/get',
      description: 'Get Phone',
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
      route: '/create',
      description: 'Create Phone'
    },
    {
      name: 'Update Phone',
      route: '/update',
      description: 'Update Phone'
    },
    {
      name: 'Delete Phone',
      route: '/delete',
      description: 'Delete Phone'
    }
  ]
}