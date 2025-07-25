const tempDocs = [
  {
    id: 1,
    content: 'Hello, this is a test message.',
    sender_id: 'user123',
    receiver_id: 'user456',
    timestamp: new Date()
  },
  {
    id: 2,
    content: 'Another message for testing.',
    sender_id: 'user789',
    receiver_id: 'user123',
    timestamp: new Date()
  }
];

exports.getAllMessages = async (req, res) => {
  const docs = tempDocs;
  
  if (!docs) {
    return res.status(404).json({
      status: 'fail',
      message: 'No messages found.'
    })
  } else {
    return res.status(200).json({
      status: 'success',
      results: docs.length,
      data: docs
    })
  };
};