const router = require('express').Router();
const cors = require('cors');

router.route('/')
  .get(cors(), (req, res) => {
    // Controller logic for getting all messages
    res.json({ message: 'Get all messages' });
  })
  .post(cors(), (req, res) => {
    // Controller logic for creating a new message
    res.json({ message: 'Create a new message' });
  });

router.route('/sender/:id')
  .get(cors(), (req, res) => {
    // Controller logic for getting messages by sender ID
    res.json({ message: `Get messages by sender ID: ${req.params.id}` });
  });

router.route('/receiver/:id')
  .get(cors(), (req, res) => {
    // Controller logic for getting messages by receiver ID
    res.json({ message: `Get messages by receiver ID: ${req.params.id}` });
  });

router.route('/message/:id')
  .get(cors(), (req, res) => {
    // Controller logic for getting a message by message ID
    res.json({ message: `Get message by message ID: ${req.params.id}` });
  });

router.route('/delete/:id')
  .delete(cors(), (req, res) => {
    // Controller logic for deleting a message by message ID
    res.json({ message: `Delete message by message ID: ${req.params.id}` });
  });

router.route('/update/:id')
  .patch(cors(), (req, res) => {
    // Controller logic for updating a message by message ID
    res.json({ message: `Update message by message ID: ${req.params.id}` });
  });

module.exports = router;