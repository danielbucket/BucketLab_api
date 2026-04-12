const AccessRecordModel = require('../../../models/accessRecord.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const createAccessRecord = async (req, res) => {
  try {
    const { userId, accessType, resource } = req.body;

    if (!userId || !accessType || !resource) {
      return res.status(400).json({
        status: 'fail',
        fail_type: 'validation_error',
        message: 'Missing required fields: userId, accessType, resource'
      });
    }

    const newRecord = await AccessRecordModel.createAccessRecord(userId, accessType, resource);

    res.status(201).json({
      status: 'success',
      data: {
        accessRecord: newRecord
      }
    });
  } catch (error) {
    console.error('Error creating access record:', error);
    res.status(500).json({
      status: 'fail',
      fail_type: 'server_error',
      message: 'An error occurred while creating the access record'
    });
  }
};

module.exports = createAccessRecord;