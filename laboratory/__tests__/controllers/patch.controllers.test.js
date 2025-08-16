const request = require('supertest');
const app = require('../../src/v1/app');
const Message = require('../../src/v1/models/message.model');
const Account = require('../../src/v1/models/account.model');
const { clearTestDB } = require('../setup');

describe('PATCH Messages Controllers', () => {
  describe('PATCH /messages/update/:id (update_message_by_message_id)', () => {
    let testMessage, testAccount, testReceiver;

    beforeEach(async () => {
      await clearTestDB();
      
      // Create test accounts for sender and receiver
      testAccount = await Account.create({
        first_name: 'Test',
        last_name: 'Sender',
        email: 'sender@test.com',
        password: 'password123'
      });

      testReceiver = await Account.create({
        first_name: 'Test',
        last_name: 'Receiver', 
        email: 'receiver@test.com',
        password: 'password456'
      });

      // Create test message
      testMessage = await Message.create({
        message: 'Original test message',
        title: 'Original title',
        sender_id: testAccount._id,
        receiver_id: testReceiver._id
      });
    });

    describe('Success Cases', () => {
      test('should update message content only', async () => {
        const updateData = {
          message: 'Updated message content'
        };

        const response = await request(app)
          .patch(`/messages/update/${testMessage._id}`)
          .send(updateData);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('Updated message content');
        expect(response.body.title).toBe('Original title'); // Should remain unchanged
        expect(response.body._id).toBe(testMessage._id.toString());
      });

      test('should update title only', async () => {
        const updateData = {
          title: 'Updated title'
        };

        const response = await request(app)
          .patch(`/messages/update/${testMessage._id}`)
          .send(updateData);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('title');
        expect(response.body.title).toBe('Updated title');
        expect(response.body.message).toBe('Original test message'); // Should remain unchanged
        expect(response.body._id).toBe(testMessage._id.toString());
      });

      test('should update both message and title', async () => {
        const updateData = {
          message: 'Updated message content',
          title: 'Updated title'
        };

        const response = await request(app)
          .patch(`/messages/update/${testMessage._id}`)
          .send(updateData);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message');
        expect(response.body).toHaveProperty('title');
        expect(response.body.message).toBe('Updated message content');
        expect(response.body.title).toBe('Updated title');
        expect(response.body._id).toBe(testMessage._id.toString());
      });

      test('should update message with maximum length content', async () => {
        const maxLengthMessage = 'a'.repeat(1000);
        const updateData = {
          message: maxLengthMessage
        };

        const response = await request(app)
          .patch(`/messages/update/${testMessage._id}`)
          .send(updateData);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe(maxLengthMessage);
        expect(response.body.message).toHaveLength(1000);
      });

      test('should update title with maximum length content', async () => {
        const maxLengthTitle = 'a'.repeat(50);
        const updateData = {
          title: maxLengthTitle
        };

        const response = await request(app)
          .patch(`/messages/update/${testMessage._id}`)
          .send(updateData);

        expect(response.status).toBe(200);
        expect(response.body.title).toBe(maxLengthTitle);
        expect(response.body.title).toHaveLength(50);
      });

      test('should update with empty message content', async () => {
        const updateData = {
          message: ''
        };

        const response = await request(app)
          .patch(`/messages/update/${testMessage._id}`)
          .send(updateData);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe('');
      });

      test('should update with empty title', async () => {
        const updateData = {
          title: ''
        };

        const response = await request(app)
          .patch(`/messages/update/${testMessage._id}`)
          .send(updateData);

        expect(response.status).toBe(200);
        expect(response.body.title).toBe('');
      });
    });

    describe('Validation Error Cases', () => {
      test('should return 400 when message exceeds maximum length', async () => {
        const updateData = {
          message: 'a'.repeat(1001) // Exceeds 1000 character limit
        };

        const response = await request(app)
          .patch(`/messages/update/${testMessage._id}`)
          .send(updateData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toContain('Validation failed');
      });

      test('should return 400 when title exceeds maximum length', async () => {
        const updateData = {
          title: 'a'.repeat(51) // Exceeds 50 character limit
        };

        const response = await request(app)
          .patch(`/messages/update/${testMessage._id}`)
          .send(updateData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toContain('Validation failed');
      });

      test('should return 400 when trying to update sender_id', async () => {
        const updateData = {
          sender_id: testReceiver._id
        };

        const response = await request(app)
          .patch(`/messages/update/${testMessage._id}`)
          .send(updateData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toContain('sender_id cannot be updated');
      });

      test('should return 400 when trying to update receiver_id', async () => {
        const updateData = {
          receiver_id: testAccount._id
        };

        const response = await request(app)
          .patch(`/messages/update/${testMessage._id}`)
          .send(updateData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toContain('receiver_id cannot be updated');
      });

      test('should return 400 when trying to update both sender_id and receiver_id', async () => {
        const updateData = {
          sender_id: testReceiver._id,
          receiver_id: testAccount._id
        };

        const response = await request(app)
          .patch(`/messages/update/${testMessage._id}`)
          .send(updateData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
      });
    });

    describe('Not Found Error Cases', () => {
      test('should return 404 when message does not exist', async () => {
        const nonExistentId = '507f1f77bcf86cd799439011'; // Valid ObjectId format
        const updateData = {
          message: 'Updated message'
        };

        const response = await request(app)
          .patch(`/messages/update/${nonExistentId}`)
          .send(updateData);

        expect(response.status).toBe(404);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toContain('Message not found');
      });

      test('should return 400 when message ID is invalid ObjectId format', async () => {
        const invalidId = 'invalid-id-123';
        const updateData = {
          message: 'Updated message'
        };

        const response = await request(app)
          .patch(`/messages/update/${invalidId}`)
          .send(updateData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toContain('Invalid message ID format');
      });
    });

    describe('Empty Request Body Cases', () => {
      test('should return 400 when no fields are provided for update', async () => {
        const response = await request(app)
          .patch(`/messages/update/${testMessage._id}`)
          .send({});

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toContain('No valid fields provided for update');
      });

      test('should return 400 when only invalid fields are provided', async () => {
        const updateData = {
          invalid_field: 'some value',
          another_invalid: 'another value'
        };

        const response = await request(app)
          .patch(`/messages/update/${testMessage._id}`)
          .send(updateData);

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toContain('No valid fields provided for update');
      });
    });

    describe('Database Persistence', () => {
      test('should actually persist the update to database', async () => {
        const updateData = {
          message: 'Persisted updated message',
          title: 'Persisted updated title'
        };

        await request(app)
          .patch(`/messages/update/${testMessage._id}`)
          .send(updateData);

        // Verify the update was persisted
        const updatedMessage = await Message.findById(testMessage._id);
        expect(updatedMessage.message).toBe('Persisted updated message');
        expect(updatedMessage.title).toBe('Persisted updated title');
      });

      test('should preserve updatedAt timestamp field', async () => {
        const updateData = {
          message: 'Updated to check timestamp'
        };

        const response = await request(app)
          .patch(`/messages/update/${testMessage._id}`)
          .send(updateData);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('updated_at');
      });

      test('should preserve original createdAt timestamp', async () => {
        const updateData = {
          message: 'Updated to check createdAt preservation'
        };

        const response = await request(app)
          .patch(`/messages/update/${testMessage._id}`)
          .send(updateData);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('created_at');
      });
    });
  });
});
