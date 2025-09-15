const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Account = require('../../../models/account.model');
const Avatar = require('../../../models/avatar.model');

// Configure multer storage for avatar uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../../../uploads/avatars');
    // Ensure the directory exists
    if (!fs.existsSync(uploadDir)) {
      try {
        console.log(`Creating avatar upload directory: ${uploadDir}`);
        fs.mkdirSync(uploadDir, { recursive: true });
      } catch (err) {
        console.error(`Failed to create upload directory: ${err.message}`);
      }
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `avatar_${req.params.id || 'unknown'}_${Date.now()}${ext}`);
  }
});

// File type and size validation
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Only .jpeg, .png, and .gif files are allowed!'), false);
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 } // 2MB limit
});


// POST /upload/:id
exports.uploadAvatar = async (req, res) => {
  upload.single('avatar')(req, res, async (err) => {
    if (err) {
      // Log Multer errors for debugging
      console.error('Multer error:', err);
      return res.status(400).json({
        status: 'fail',
        message: err.message
      });
    }
    try {
      const { id } = req.params;
      if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
        // Clean up uploaded file if present
        if (req.file) fs.unlink(req.file.path, () => {});
        return res.status(400).json({
          status: 'fail',
          message: 'Invalid account ID format.'
        });
      }
      if (!req.file) {
        return res.status(400).json({
          status: 'fail',
          message: 'No avatar file uploaded or invalid file type.'
        });
      }
      const doc = await Account.findById(id);
      if (!doc) {
        // Clean up uploaded file if present
        if (req.file) fs.unlink(req.file.path, () => {});
        return res.status(404).json({
          status: 'fail',
          message: 'No account found with that ID.'
        });
      }
      // Read the uploaded file as a buffer and store in MongoDB
      const filePath = req.file.path;
      const fileBuffer = fs.readFileSync(filePath);
      
      // Create a new Avatar document
      const avatar = new Avatar({
        filename: req.file.filename,
        avatar_data: fileBuffer,
        content_type: req.file.mimetype,
        user_id: doc._id
      });
      
      // Save the avatar to MongoDB
      const savedAvatar = await avatar.save();
      
      // Update the account with reference to the avatar
      doc.avatar_id = savedAvatar._id;
      await doc.save();
      
      // Remove the file from disk after saving to DB
      fs.unlink(filePath, () => {});
      
      return res.status(200).json({
        status: 'success',
        message: 'Avatar uploaded and saved to database.',
        avatar_id: savedAvatar._id,
        avatar_content_type: req.file.mimetype,
        avatar_size: fileBuffer.length
      });
    } catch (error) {
      // Clean up uploaded file if DB save fails
      if (req.file) fs.unlink(req.file.path, () => {});
      return res.status(500).json({
        status: 'error',
        message: 'Avatar upload failed.',
        error: error.message
      });
    }
  });
};
