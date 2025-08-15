const mongoose = require('mongoose');
const Message = require('../../src/v1/models/message.model');

describe('Message Model', () => {
  describe('Schema Validation', () => {
    it('should create a valid message with all required fields', async () => {
      const senderId = new mongoose.Types.ObjectId();
      const receiverId = new mongoose.Types.ObjectId();
      
      const messageData = {
        message: 'This is a test message',
        title: 'Test Message',
        receiver_id: receiverId,
        sender_id: senderId
      };

      const message = new Message(messageData);
      const savedMessage = await message.save();

      expect(savedMessage._id).toBeDefined();
      expect(savedMessage.message).toBe('This is a test message');
      expect(savedMessage.title).toBe('Test Message');
      expect(savedMessage.receiver_id).toEqual(receiverId);
      expect(savedMessage.sender_id).toEqual(senderId);
      expect(savedMessage.created_at).toBeDefined();
      expect(savedMessage.updated_at).toBeDefined();
    });

    it('should fail validation when required fields are missing', async () => {
      const message = new Message({
        message: 'Test message without required fields'
      });

      let error;
      try {
        await message.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.receiver_id).toBeDefined();
      expect(error.errors.sender_id).toBeDefined();
    });

    it('should allow message to be up to 1000 characters', async () => {
      const senderId = new mongoose.Types.ObjectId();
      const receiverId = new mongoose.Types.ObjectId();
      const longMessage = 'a'.repeat(1000);
      
      const messageData = {
        message: longMessage,
        title: 'Long Message',
        receiver_id: receiverId,
        sender_id: senderId
      };

      const message = new Message(messageData);
      const savedMessage = await message.save();

      expect(savedMessage.message).toBe(longMessage);
    });

    it('should fail validation when message exceeds 1000 characters', async () => {
      const senderId = new mongoose.Types.ObjectId();
      const receiverId = new mongoose.Types.ObjectId();
      const tooLongMessage = 'a'.repeat(1001);
      
      const messageData = {
        message: tooLongMessage,
        title: 'Too Long Message',
        receiver_id: receiverId,
        sender_id: senderId
      };

      const message = new Message(messageData);
      
      let error;
      try {
        await message.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.message).toBeDefined();
    });

    it('should allow title to be up to 50 characters', async () => {
      const senderId = new mongoose.Types.ObjectId();
      const receiverId = new mongoose.Types.ObjectId();
      const longTitle = 'a'.repeat(50);
      
      const messageData = {
        message: 'Test message',
        title: longTitle,
        receiver_id: receiverId,
        sender_id: senderId
      };

      const message = new Message(messageData);
      const savedMessage = await message.save();

      expect(savedMessage.title).toBe(longTitle);
    });

    it('should fail validation when title exceeds 50 characters', async () => {
      const senderId = new mongoose.Types.ObjectId();
      const receiverId = new mongoose.Types.ObjectId();
      const tooLongTitle = 'a'.repeat(51);
      
      const messageData = {
        message: 'Test message',
        title: tooLongTitle,
        receiver_id: receiverId,
        sender_id: senderId
      };

      const message = new Message(messageData);
      
      let error;
      try {
        await message.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
      expect(error.errors.title).toBeDefined();
    });

    it('should validate ObjectId format for sender_id and receiver_id', async () => {
      const messageData = {
        message: 'Test message',
        title: 'Test',
        receiver_id: 'invalid-object-id',
        sender_id: 'also-invalid'
      };

      const message = new Message(messageData);
      
      let error;
      try {
        await message.save();
      } catch (err) {
        error = err;
      }

      expect(error).toBeDefined();
    });

    it('should automatically set created_at and updated_at timestamps', async () => {
      const senderId = new mongoose.Types.ObjectId();
      const receiverId = new mongoose.Types.ObjectId();
      
      const messageData = {
        message: 'Timestamp test',
        title: 'Timestamp',
        receiver_id: receiverId,
        sender_id: senderId
      };

      const message = new Message(messageData);
      const savedMessage = await message.save();

      expect(savedMessage.created_at).toBeDefined();
      expect(savedMessage.updated_at).toBeDefined();
      expect(savedMessage.created_at).toBeInstanceOf(Date);
      expect(savedMessage.updated_at).toBeInstanceOf(Date);
    });

    it('should allow empty message and title fields', async () => {
      const senderId = new mongoose.Types.ObjectId();
      const receiverId = new mongoose.Types.ObjectId();
      
      const messageData = {
        receiver_id: receiverId,
        sender_id: senderId
      };

      const message = new Message(messageData);
      const savedMessage = await message.save();

      expect(savedMessage._id).toBeDefined();
      expect(savedMessage.receiver_id).toEqual(receiverId);
      expect(savedMessage.sender_id).toEqual(senderId);
    });
  });

  describe('References', () => {
    it('should properly reference Account model for sender_id and receiver_id', async () => {
      const senderId = new mongoose.Types.ObjectId();
      const receiverId = new mongoose.Types.ObjectId();
      
      const messageData = {
        message: 'Reference test',
        title: 'References',
        receiver_id: receiverId,
        sender_id: senderId
      };

      const message = new Message(messageData);
      const savedMessage = await message.save();

      // Check that the ObjectIds are properly stored
      expect(savedMessage.sender_id.toString()).toBe(senderId.toString());
      expect(savedMessage.receiver_id.toString()).toBe(receiverId.toString());
    });
  });
});
