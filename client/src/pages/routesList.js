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
      middleware: 'auth',
      children: [
        {
          name: 'Get Profile by ID',
          route: '/:id',
          description: 'Get Profile by ID',
          type: 'controller/endpoint',
          middleware: 'none'
        },
      ]
    },
    {
      name: 'Create Profile',
      route: '/create',
      description: 'Create Profile',
      type: 'router',
      middleware: 'none'
    },
    {
      name: 'Update Profile',
      route: '/update',
      description: 'Update Profile',
      type: 'router',
      middleware: 'none'
    },
    {
      name: 'Delete Profile',
      route: '/delete',
      description: 'Delete Profile',
      type: 'router',
      middleware: 'none'
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
      middleware: 'none',
      children: [
        {
          name: 'Get User by ID',
          route: '/:id',
          description: 'Get User by ID',
          type: 'controller/endpoint',
          middleware: 'none'
        },
        {
          name: 'Get User by Email',
          route: '/:email',
          description: 'Get the user data using the asscociated email address.',
          type: 'controller/endpoint',
          middleware: 'none'
        }
      ],
    },
    {
      name: 'Create User',
      route: '/create',
      description: 'Create User',
      type: 'router',
      middleware: 'none'
    },
    {
      name: 'Update User',
      route: '/update',
      description: 'Update User',
      type: 'router',
      middleware: 'none'
    },
    {
      name: 'Delete User',
      route: '/delete',
      description: 'Delete User',
      type: 'router',
      middleware: 'none'
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
      middleware: 'none',
      children: [
        {
          name: 'Get Phone by ID',
          route: '/:id',
          description: 'Get Phone by ID',
          type: 'controller/endpoint',
          middleware: 'none'
        },
        {
          name: 'Get Phone by Number',
          route: '/:number',
          description: 'Get Phone by Number',
          type: 'controller/endpoint',
          middleware: 'none'
        }
      ],
    },
    {
      name: 'Create Phone',
      route: '/create',
      description: 'Create Phone',
      type: 'router',
      middleware: 'none'
    },
    {
      name: 'Update Phone',
      route: '/update',
      description: 'Update Phone',
      type: 'router',
      middleware: 'none'
    },
    {
      name: 'Delete Phone',
      route: '/delete',
      description: 'Delete Phone',
      type: 'router',
      middleware: 'none'
    }
  ]
}