const Account = require('../../../models/account.model');

exports.getAccountByAccountId = async (req, res) => {
  const id = req.params.id;
  const doc = await Account.findById(id);

  if (!doc) {
    return res.status(404).json({
      status: 'fail',
      message: 'No account found with that ID.'
    });
  }

  const returnedAccountData = Object.assign({}, {
    first_name: doc.first_name,
    last_name: doc.last_name,
    email: doc.email,
    website: doc.website,
    company: doc.company,
    phone: doc.phone,
    messages: doc.messages,
    created_at: doc.created_at
  });

  return res.status(200).json({
    status: 'success',
    data: { ...returnedAccountData }
  });

};