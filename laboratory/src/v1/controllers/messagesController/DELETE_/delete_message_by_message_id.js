const Message = require('../../../models/message.model.js');

exports.delete_message_by_message_id = async (req, res) => {
  const id = req.params.id;

  try {
    const doc = await Message.findById(id);

    if (!doc) {
      return res.status(404).json({
        status: 'fail',
        message: 'No message found with that ID.'
      });
    }

    const deleted = await doc.deleteOne();

    if (!deleted) {
      return res.status(500).json({
        status: 'error',
        message: 'Message deletion failed.'
      });
    } else {
      return res.status(204).end();
    }
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Error deleting message.',
      data: error.message
    });
  }
};