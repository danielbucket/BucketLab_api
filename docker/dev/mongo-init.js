// MongoDB initialization - minimal, non-blocking
// Focus on fastest possible user creation without waiting for external resources

try {
  db.getSiblingDB('admin').createUser({
    user: 'empirical_explorer',
    pwd: 'hg48s.2s9dFF.EZpoopin',
    roles: [{ role: 'root', db: 'admin' }]
  });
  print('User created');
} catch (e) {
  if (e.code === 48) {
    print('User exists');
  } else {
    print('Error: ' + e);
  }
}
