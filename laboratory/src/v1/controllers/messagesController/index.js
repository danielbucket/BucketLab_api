
module.exports = Object.freeze(
  Object.assign({},
    { DELETE_methods: require('./DELETE') },
    { GET_methods: require('./GET') },
    { PATCH_methods: require('./PATCH') },
    { POST_methods: require('./POST') }
  )
);