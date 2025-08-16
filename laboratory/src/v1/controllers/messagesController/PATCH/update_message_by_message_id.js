const Message = require('../../../models/message.model');
const mongoose = require('mongoose');

exports.update_message_by_message_id = async (req, res) => {
  const id = req.params.id;
  const { body } = req;

  try {
    // Validate ObjectId format
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: 'Invalid message ID format'
      });
    }

    // Check if any valid fields provided for update
    const allowedFields = ['message', 'title'];
    const providedFields = Object.keys(body).filter(key => allowedFields.includes(key));
    
    if (providedFields.length === 0) {
      // Check if sender_id or receiver_id were attempted to be updated
      if (body.hasOwnProperty('sender_id') || body.hasOwnProperty('receiver_id')) {
        const restrictedField = body.hasOwnProperty('sender_id') ? 'sender_id' : 'receiver_id';
        return res.status(400).json({
          error: `${restrictedField} cannot be updated`
        });
      }
      
      return res.status(400).json({
        error: 'No valid fields provided for update'
      });
    }

    // Check for restricted fields
    if (body.hasOwnProperty('sender_id')) {
      return res.status(400).json({
        error: 'sender_id cannot be updated'
      });
    }

    if (body.hasOwnProperty('receiver_id')) {
      return res.status(400).json({
        error: 'receiver_id cannot be updated'
      });
    }

    // Build update object with only valid fields
    const updateData = {};
    providedFields.forEach(field => {
      updateData[field] = body[field];
    });

    const updatedMessage = await Message.findByIdAndUpdate(
      id, 
      updateData, 
      { 
        new: true, 
        runValidators: true,
        timestamps: true
      }
    );

    if (!updatedMessage) {
      return res.status(404).json({
        error: 'Message not found'
      });
    }

    return res.status(200).json(updatedMessage);

  } catch (error) {
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        error: `Validation failed: ${error.message}`
      });
    }

    if (error.name === 'CastError') {
      return res.status(400).json({
        error: 'Invalid message ID format'
      });
    }

    return res.status(500).json({
      error: 'Internal server error',
      details: error.message
    });
  }
};