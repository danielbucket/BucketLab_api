const auth = require('../../models/auth.model');

const seedAuthData = [
  {
    email: 'empire@bucketlab.io',
    password: 'Passw0rd!',
    permissions: [
      { name: 'empire' }
    ],
    permissions: [
      { name: 'empire', approval_status: 'approved' },
    ],
    logged_in: false
  },
  {
    email: 'bucky@buttfinger.com',
    password: 'Passw0rd',
    permissions: [
      { name: 'guest', approval_status: 'approved' },
      { name: 'read:profile', approval_status: 'approved' },
      { name: 'delete:profile', approval_status: 'approved' }
    ],
    logged_in: false
  },
  {
    email: 'harry@hammerdique.com',
    password: 'Passw0rd',
    permissions: [
      { name: 'guest', approval_status: 'approved' },
      { name: 'read:profile', approval_status: 'approved' }
    ],
    logged_in: false
  },
  {
    email: 'betty@nuggstrong.com',
    password: 'Passw0rd',
    permissions: [
      { name: 'guest', approval_status: 'approved' },
      { name: 'read:profile', approval_status: 'approved' },
      { name: 'delete:profile', approval_status: 'approved' }
    ],
    logged_in: false
  }
];

const seedAuthModels = async () => {
  try {
    // Clear existing auth records
    await auth.deleteMany({});
    console.log('Cleared existing auth records');

    // Insert seed data (without depends_on_profile, will be set after profiles are created)
    const createdAuthRecords = await auth.insertMany(seedAuthData);
    console.log(`Successfully seeded ${createdAuthRecords.length} auth records`);

    return createdAuthRecords;
  } catch (error) {
    console.error('Error seeding auth data:', error.message);
    throw error;
  }
};

const updateAuthWithProfile = async (profileRecords) => {
  try {
    // Update each auth record with its corresponding profile record reference
    const updatePromises = profileRecords.map((profileRecord, index) =>
      auth.findByIdAndUpdate(
        profileRecord.depends_on_auth,
        { depends_on_profile: profileRecord._id },
        { new: true }
      )
    );

    await Promise.all(updatePromises);
    console.log(`Successfully linked ${profileRecords.length} profile records to auth`);
  } catch (error) {
    console.error('Error updating auth with profile references:', error.message);
    throw error;
  }
};

module.exports = { seedAuthModels, updateAuthWithProfile, seedAuthData };
