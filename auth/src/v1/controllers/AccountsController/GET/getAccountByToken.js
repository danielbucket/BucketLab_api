const Account = require('../../../models/account.model'); // Adjust the path as necessary

exports.getAccountByToken = async (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.sendStatus(401);

  const { user } = req;
  const accountData = await Account.findById(user.id);

  const returnedAccountData = Object.assign({}, {
    first_name: accountData.first_name,
    last_name: accountData.last_name,
    email: accountData.email,
    website: accountData.website,
    company: accountData.company,
    phone: accountData.phone,
    messages: accountData.messages,
    created_at: accountData.created_at
  });

  if (!accountData) return res.sendStatus(404);
  return res.status(200).json({
    status: 'success',
    accountData: returnedAccountData
  });
};
