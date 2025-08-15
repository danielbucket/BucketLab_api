const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/v1/app');
const Message = require('../../src/v1/models/message.model');
const Account = require('../../src/v1/models/account.model');
const { clearTestDB } = require('../setup');

describe('POST Messages Controllers', () => {
  let testAccount1, testAccount2;
  
  beforeEach(async () => {
    await clearTestDB();
    
    // Create test accounts for message references
    testAccount1 = new Account({
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      password: 'hashedPassword123'
    });
    await testAccount1.save();
    
    testAccount2 = new Account({
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'jane.smith@example.com', 
      password: 'hashedPassword456'
    });
    await testAccount2.save();
  });

  describe('POST /messages (new_message)', () => {
    describe('Success Cases', () => {
      it('should create a new message with all required fields', async () => {
        const messageData = {
          message: 'Hello, this is a test message',
          title: 'Test Message',
          sender_id: testAccount1._id,
          receiver_id: testAccount2._id
        };

        const response = await request(app)
          .post('/messages')
          .send(messageData)
          .expect(201);

        expect(response.body.status).toBe('success');
        expect(response.body.data).toBeDefined();
        expect(response.body.data.message).toBe(messageData.message);
        expect(response.body.data.title).toBe(messageData.title);
        expect(response.body.data.sender_id).toBe(messageData.sender_id.toString());
        expect(response.body.data.receiver_id).toBe(messageData.receiver_id.toString());
        expect(response.body.data._id).toBeDefined();
        expect(response.body.data.created_at).toBeDefined();
        expect(response.body.data.updated_at).toBeDefined();
      });

      it('should create message with maximum length content', async () => {
        const longMessage = 'A'.repeat(1000);
        const longTitle = 'B'.repeat(50);

        const messageData = {
          message: longMessage,
          title: longTitle,
          sender_id: testAccount1._id,
          receiver_id: testAccount2._id
        };

        const response = await request(app)
          .post('/messages')
          .send(messageData)
          .expect(201);

        expect(response.body.status).toBe('success');
        expect(response.body.data.message).toBe(longMessage);
        expect(response.body.data.title).toBe(longTitle);
      });

      it('should create message with empty message and title fields', async () => {
        const messageData = {
          message: '',
          title: '',
          sender_id: testAccount1._id,
          receiver_id: testAccount2._id
        };

        const response = await request(app)
          .post('/messages')
          .send(messageData)
          .expect(201);

        expect(response.body.status).toBe('success');
        expect(response.body.data.message).toBe('');
        expect(response.body.data.title).toBe('');
      });
    });

    describe('Validation Error Cases', () => {
      it('should return 422 when message field is missing', async () => {
        const messageData = {
          title: 'Test Message',
          sender_id: testAccount1._id,
          receiver_id: testAccount2._id
        };

        const response = await request(app)
          .post('/messages')
          .send(messageData)
          .expect(422);

        expect(response.body.status).toBe('error');
        expect(response.body.message).toBe('Missing required parameter: message');
      });

      it('should return 422 when title field is missing', async () => {
        const messageData = {
          message: 'Hello, this is a test message',
          sender_id: testAccount1._id,
          receiver_id: testAccount2._id
        };

        const response = await request(app)
          .post('/messages')
          .send(messageData)
          .expect(422);

        expect(response.body.status).toBe('error');
        expect(response.body.message).toBe('Missing required parameter: title');
      });

      it('should return 422 when sender_id field is missing', async () => {
        const messageData = {
          message: 'Hello, this is a test message',
          title: 'Test Message',
          receiver_id: testAccount2._id
        };

        const response = await request(app)
          .post('/messages')
          .send(messageData)
          .expect(422);

        expect(response.body.status).toBe('error');
        expect(response.body.message).toBe('Missing required parameter: sender_id');
      });

      it('should return 422 when receiver_id field is missing', async () => {
        const messageData = {
          message: 'Hello, this is a test message',
          title: 'Test Message',
          sender_id: testAccount1._id
        };

        const response = await request(app)
          .post('/messages')
          .send(messageData)
          .expect(422);

        expect(response.body.status).toBe('error');
        expect(response.body.message).toBe('Missing required parameter: receiver_id');
      });

      it('should return 400 when message exceeds maximum length', async () => {
        const longMessage = 'A'.repeat(1001); // 1001 characters

        const messageData = {
          message: longMessage,
          title: 'Test Message',
          sender_id: testAccount1._id,
          receiver_id: testAccount2._id
        };

        const response = await request(app)
          .post('/messages')
          .send(messageData)
          .expect(400);

        expect(response.body.status).toBe('error');
        expect(response.body.message).toContain('validation failed');
      });

      it('should return 400 when title exceeds maximum length', async () => {
        const longTitle = 'B'.repeat(51); // 51 characters

        const messageData = {
          message: 'Test message',
          title: longTitle,
          sender_id: testAccount1._id,
          receiver_id: testAccount2._id
        };

        const response = await request(app)
          .post('/messages')
          .send(messageData)
          .expect(400);

        expect(response.body.status).toBe('error');
        expect(response.body.message).toContain('validation failed');
      });

      it('should return 400 when sender_id is invalid ObjectId format', async () => {
        const messageData = {
          message: 'Hello, this is a test message',
          title: 'Test Message',
          sender_id: 'invalid-id',
          receiver_id: testAccount2._id
        };

        const response = await request(app)
          .post('/messages')
          .send(messageData)
          .expect(400);

        expect(response.body.status).toBe('error');
        expect(response.body.message).toContain('validation failed');
      });

      it('should return 400 when receiver_id is invalid ObjectId format', async () => {
        const messageData = {
          message: 'Hello, this is a test message',
          title: 'Test Message',
          sender_id: testAccount1._id,
          receiver_id: 'invalid-id'
        };

        const response = await request(app)
          .post('/messages')
          .send(messageData)
          .expect(400);

        expect(response.body.status).toBe('error');
        expect(response.body.message).toContain('validation failed');
      });
    });

    describe('Database Reference Error Cases', () => {
      it('should return 404 when sender account does not exist', async () => {
        const nonExistentId = new mongoose.Types.ObjectId();

        const messageData = {
          message: 'Hello, this is a test message',
          title: 'Test Message',
          sender_id: nonExistentId,
          receiver_id: testAccount2._id
        };

        const response = await request(app)
          .post('/messages')
          .send(messageData)
          .expect(404);

        expect(response.body.status).toBe('error');
        expect(response.body.message).toBe('Sender account not found.');
      });

      it('should return 404 when receiver account does not exist', async () => {
        const nonExistentId = new mongoose.Types.ObjectId();

        const messageData = {
          message: 'Hello, this is a test message',
          title: 'Test Message',
          sender_id: testAccount1._id,
          receiver_id: nonExistentId
        };

        const response = await request(app)
          .post('/messages')
          .send(messageData)
          .expect(404);

        expect(response.body.status).toBe('error');
        expect(response.body.message).toBe('Receiver account not found.');
      });

      it('should return 404 when both sender and receiver do not exist', async () => {
        const nonExistentId1 = new mongoose.Types.ObjectId();
        const nonExistentId2 = new mongoose.Types.ObjectId();

        const messageData = {
          message: 'Hello, this is a test message',
          title: 'Test Message',
          sender_id: nonExistentId1,
          receiver_id: nonExistentId2
        };

        const response = await request(app)
          .post('/messages')
          .send(messageData)
          .expect(404);

        expect(response.body.status).toBe('error');
        expect(response.body.message).toBe('Sender account not found.');
      });
    });

    describe('Database Persistence', () => {
      it('should actually save the message to database', async () => {
        const messageData = {
          message: 'Database persistence test',
          title: 'Persistence Test',
          sender_id: testAccount1._id,
          receiver_id: testAccount2._id
        };

        const response = await request(app)
          .post('/messages')
          .send(messageData)
          .expect(201);

        // Verify the message was saved to database
        const savedMessage = await Message.findById(response.body.data._id);
        expect(savedMessage).toBeTruthy();
        expect(savedMessage.message).toBe(messageData.message);
        expect(savedMessage.title).toBe(messageData.title);
        expect(savedMessage.sender_id.toString()).toBe(messageData.sender_id.toString());
        expect(savedMessage.receiver_id.toString()).toBe(messageData.receiver_id.toString());
      });

      it('should set automatic timestamps correctly', async () => {
        const messageData = {
          message: 'Timestamp test',
          title: 'Timestamp Test',
          sender_id: testAccount1._id,
          receiver_id: testAccount2._id
        };

        const beforeTime = new Date();
        
        const response = await request(app)
          .post('/messages')
          .send(messageData)
          .expect(201);

        const afterTime = new Date();

        const createdAt = new Date(response.body.data.created_at);
        const updatedAt = new Date(response.body.data.updated_at);

        expect(createdAt).toBeInstanceOf(Date);
        expect(updatedAt).toBeInstanceOf(Date);
        expect(createdAt.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
        expect(createdAt.getTime()).toBeLessThanOrEqual(afterTime.getTime());
        expect(updatedAt.getTime()).toBeGreaterThanOrEqual(beforeTime.getTime());
        expect(updatedAt.getTime()).toBeLessThanOrEqual(afterTime.getTime());
      });
    });
  });
});
