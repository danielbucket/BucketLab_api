const profile = require('../../models/profile.model');

const seedProfileData = [
  {
    first_name: 'Empire',
    last_name: 'Bucket',
    email: 'empire@bucketlab.io',
    notes: 'The supreme ruler of the BucketLab Empire, overseeing all operations and access',
    website: 'https://bucketlab.io',
    company: 'BucketLab Empire',
    phone: '+1-555-0101',
    messages: []
  },
  {
    first_name: 'Bucky',
    last_name: 'Explorer',
    email: 'bucky@buttfinger.com',
    notes: 'A seasoned traveler with special gateway access',
    website: 'https://buttfinger.com',
    company: 'Buttfinger Salad, Inc.',
    phone: '+1-555-0100',
    messages: []
  },
  {
    first_name: 'Harry',
    last_name: 'Hammerdique',
    email: 'harry@hammerdique.com',
    notes: 'Standard guest user with limited permissions',
    website: null,
    company: 'Guest Organization',
    phone: null,
    messages: []
  },
  {
    first_name: 'Betty',
    last_name: 'Nuggstrong',
    email: 'betty@nuggstrong.com',
    notes: 'Betty, Betty Nuggs. Nuggs Betty.',
    website: 'strongnuggs.com',
    company: 'Caverperson Nuggs, Inc.',
    phone: '+1-555-0102',
    messages: []
  }
];

const seedProfileModels = async (authRecords) => {
  try {
    // Clear existing profile records
    await profile.deleteMany({});
    console.log('Cleared existing profile records');

    // Add depends_on_auth reference to each profile using the auth record IDs
    const profilesWithAuth = seedProfileData.map((prof, index) => ({
      ...prof,
      depends_on_auth: authRecords[index]._id
    }));

    // Insert seed data
    const createdProfileRecords = await profile.insertMany(profilesWithAuth);
    console.log(`Successfully seeded ${createdProfileRecords.length} profile records`);

    return createdProfileRecords;
  } catch (error) {
    console.error('Error seeding profile data:', error.message);
    throw error;
  }
};

const updateAuthWithProfile = async (authRecords, profileRecords) => {
  try {
    // Update each auth record with its corresponding profile record reference
    const updatePromises = authRecords.map((authRecord, index) =>
      auth.findByIdAndUpdate(
        authRecord._id,
        { depends_on_profile: profileRecords[index]._id },
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

module.exports = { seedProfileModels, updateAuthWithProfile, seedProfileData };
