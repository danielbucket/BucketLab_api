export const profileController = {
  name: 'Profile',
  route: 'api/v1/profile',
  description: 'Profile controller root.',
  type: 'root/server',
  children: [
    {
      name: 'Get Profile',
      route: '/get',
      description: 'Get Profile',
      type: 'router',
      children: [
        {
          name: 'Get Profile by ID',
          route: '/:id',
          description: 'Get Profile by ID',
          type: 'controller/endpoint'
        },
      ]
    },
    {
      name: 'Create Profile',
      route: '/create',
      description: 'Create Profile',
      type: 'router'
    },
    {
      name: 'Update Profile',
      route: '/update',
      description: 'Update Profile',
      type: 'router',
    },
    {
      name: 'Delete Profile',
      route: '/delete',
      description: 'Delete Profile',
      type: 'router'
    }
  ]
}

export const userController =  {
  name: 'User',
  route: 'api/v1/user',
  description: 'User controller root.',
  type: 'root/server',
  children: [
    {
      name: 'Get User',
      route: '/get',
      description: 'Get user information. Used at user login.',
      type: 'router',
      children: [
        {
          name: 'Get User by ID',
          route: '/:id',
          description: 'Get User by ID',
          type: 'controller/endpoint'
        },
        {
          name: 'Get User by Email',
          route: '/:email',
          description: 'Get the user data using the asscociated email address.',
          type: 'controller/endpoint'
        }
      ],
    },
    {
      name: 'Create User',
      route: '/create',
      description: 'Create User',
      type: 'router'
    },
    {
      name: 'Update User',
      route: '/update',
      description: 'Update User',
      type: 'router'
    },
    {
      name: 'Delete User',
      route: '/delete',
      description: 'Delete User',
      type: 'router'
    }
  ]
}

export const phoneController = {
  name: 'Phone',
  route: 'api/v1/phone',
  description: 'Phone controller root.',
  type: 'root/server',
  children: [
    {
      name: 'Get Phone',
      route: '/get',
      description: 'Get Phone',
      type: 'router',
      children: [
        {
          name: 'Get Phone by ID',
          route: '/:id',
          description: 'Get Phone by ID',
          type: 'controller/endpoint'
        },
        {
          name: 'Get Phone by Number',
          route: '/:number',
          description: 'Get Phone by Number',
          type: 'controller/endpoint'
        }
      ],
    },
    {
      name: 'Create Phone',
      route: '/create',
      description: 'Create Phone',
      type: 'router'
    },
    {
      name: 'Update Phone',
      route: '/update',
      description: 'Update Phone',
      type: 'router'
    },
    {
      name: 'Delete Phone',
      route: '/delete',
      description: 'Delete Phone',
      type: 'router'
    }
  ]
}