const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/v1/app');
const Message = require('../../src/v1/models/message.model');
const Account = require('../../src/v1/models/account.model');

describe('GET Messages Controllers', () => {
  describe('GET /messages (get_all_messages)', () => {
    describe('Success Cases', () => {
      it('should return all messages when messages exist', async () => {
        const sender = await Account.create({
          first_name: 'Sender',
          last_name: 'Test',
          email: 'sender@example.com',
          password: 'password123'
        });

        const receiver = await Account.create({
          first_name: 'Receiver',
          last_name: 'Test',
          email: 'receiver@example.com',
          password: 'password123'
        });

        await Message.create({
          message: 'Test message 1',
          title: 'Title 1',
          sender_id: sender._id,
          receiver_id: receiver._id
        });

        await Message.create({
          message: 'Test message 2',
          title: 'Title 2',
          sender_id: sender._id,
          receiver_id: receiver._id
        });

        const response = await request(app)
          .get('/messages')
          .expect(200);

        expect(response.body.status).toBe('success');
        expect(response.body.results).toBe(2);
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data).toHaveLength(2);
      });

      it('should return empty array when no messages exist', async () => {
        const response = await request(app)
          .get('/messages')
          .expect(200);

        expect(response.body.status).toBe('success');
        expect(response.body.results).toBe(0);
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data).toHaveLength(0);
      });

      it('should return messages with all expected fields', async () => {
        const sender = await Account.create({
          first_name: 'Sender',
          last_name: 'Test',
          email: 'sender@example.com',
          password: 'password123'
        });

        const receiver = await Account.create({
          first_name: 'Receiver',
          last_name: 'Test',
          email: 'receiver@example.com',
          password: 'password123'
        });

        await Message.create({
          message: 'Test message with fields',
          title: 'Field Test',
          sender_id: sender._id,
          receiver_id: receiver._id
        });

        const response = await request(app)
          .get('/messages')
          .expect(200);

        const message = response.body.data[0];
        expect(message.message).toBe('Test message with fields');
        expect(message.title).toBe('Field Test');
        expect(message.sender_id).toBe(sender._id.toString());
        expect(message.receiver_id).toBe(receiver._id.toString());
        expect(message.created_at).toBeDefined();
        expect(message.updated_at).toBeDefined();
        expect(message._id).toBeDefined();
      });
    });
  });

  describe('GET /messages/message/:id (get_message_by_message_id)', () => {
    describe('Success Cases', () => {
      it('should return specific message by ID', async () => {
        const sender = await Account.create({
          first_name: 'Sender',
          last_name: 'Test',
          email: 'sender@example.com',
          password: 'password123'
        });

        const receiver = await Account.create({
          first_name: 'Receiver',
          last_name: 'Test',
          email: 'receiver@example.com',
          password: 'password123'
        });

        const message = await Message.create({
          message: 'Specific test message',
          title: 'Specific Title',
          sender_id: sender._id,
          receiver_id: receiver._id
        });

        const response = await request(app)
          .get(`/messages/message/${message._id}`)
          .expect(200);

        expect(response.body.status).toBe('success');
        expect(response.body.data.doc.message).toBe('Specific test message');
        expect(response.body.data.doc.title).toBe('Specific Title');
        expect(response.body.data.doc._id).toBe(message._id.toString());
      });

      it('should return message with all fields', async () => {
        const sender = await Account.create({
          first_name: 'Sender',
          last_name: 'Test',
          email: 'sender@example.com',
          password: 'password123'
        });

        const receiver = await Account.create({
          first_name: 'Receiver',
          last_name: 'Test',
          email: 'receiver@example.com',
          password: 'password123'
        });

        const message = await Message.create({
          message: 'Complete message test',
          title: 'Complete Title',
          sender_id: sender._id,
          receiver_id: receiver._id
        });

        const response = await request(app)
          .get(`/messages/message/${message._id}`)
          .expect(200);

        const doc = response.body.data.doc;
        expect(doc._id).toBeDefined();
        expect(doc.message).toBe('Complete message test');
        expect(doc.title).toBe('Complete Title');
        expect(doc.sender_id).toBe(sender._id.toString());
        expect(doc.receiver_id).toBe(receiver._id.toString());
        expect(doc.created_at).toBeDefined();
        expect(doc.updated_at).toBeDefined();
      });
    });

    describe('Error Cases', () => {
      it('should return 404 when message does not exist', async () => {
        const nonExistentId = new mongoose.Types.ObjectId();

        const response = await request(app)
          .get(`/messages/message/${nonExistentId}`)
          .expect(404);

        expect(response.body.status).toBe('fail');
        expect(response.body.message).toBe('No message found with that ID.');
      });

      it('should handle invalid ID format gracefully', async () => {
        const response = await request(app)
          .get('/messages/message/invalid-id')
          .expect(500);

        expect(response.body.status).toBe('error');
      });
    });
  });

  describe('GET /messages/sender/:id (get_messages_by_sender_id)', () => {
    describe('Success Cases', () => {
      it('should return messages by sender ID', async () => {
        const sender = await Account.create({
          first_name: 'Sender',
          last_name: 'Test',
          email: 'sender@example.com',
          password: 'password123'
        });

        const receiver1 = await Account.create({
          first_name: 'Receiver1',
          last_name: 'Test',
          email: 'receiver1@example.com',
          password: 'password123'
        });

        const receiver2 = await Account.create({
          first_name: 'Receiver2',
          last_name: 'Test',
          email: 'receiver2@example.com',
          password: 'password123'
        });

        await Message.create({
          message: 'Message to receiver 1',
          title: 'Title 1',
          sender_id: sender._id,
          receiver_id: receiver1._id
        });

        await Message.create({
          message: 'Message to receiver 2',
          title: 'Title 2',
          sender_id: sender._id,
          receiver_id: receiver2._id
        });

        const response = await request(app)
          .get(`/messages/sender/${sender._id}`)
          .expect(200);

        expect(response.body.status).toBe('success');
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data).toHaveLength(2);
        expect(response.body.data[0].sender_id).toBe(sender._id.toString());
        expect(response.body.data[1].sender_id).toBe(sender._id.toString());
      });
    });

    describe('Error Cases', () => {
      it('should return 404 when no messages found for sender', async () => {
        const nonExistentId = new mongoose.Types.ObjectId();

        const response = await request(app)
          .get(`/messages/sender/${nonExistentId}`)
          .expect(404);

        expect(response.body.status).toBe('fail');
        expect(response.body.message).toBe('No messages found with that sender ID.');
      });
    });
  });

  describe('GET /messages/receiver/:id (get_messages_by_receiver_id)', () => {
    describe('Success Cases', () => {
      it('should return messages by receiver ID', async () => {
        const sender1 = await Account.create({
          first_name: 'Sender1',
          last_name: 'Test',
          email: 'sender1@example.com',
          password: 'password123'
        });

        const sender2 = await Account.create({
          first_name: 'Sender2',
          last_name: 'Test',
          email: 'sender2@example.com',
          password: 'password123'
        });

        const receiver = await Account.create({
          first_name: 'Receiver',
          last_name: 'Test',
          email: 'receiver@example.com',
          password: 'password123'
        });

        await Message.create({
          message: 'Message from sender 1',
          title: 'Title 1',
          sender_id: sender1._id,
          receiver_id: receiver._id
        });

        await Message.create({
          message: 'Message from sender 2',
          title: 'Title 2',
          sender_id: sender2._id,
          receiver_id: receiver._id
        });

        const response = await request(app)
          .get(`/messages/receiver/${receiver._id}`)
          .expect(200);

        expect(response.body.status).toBe('success');
        expect(Array.isArray(response.body.data)).toBe(true);
        expect(response.body.data).toHaveLength(2);
        expect(response.body.data[0].receiver_id).toBe(receiver._id.toString());
        expect(response.body.data[1].receiver_id).toBe(receiver._id.toString());
      });
    });

    describe('Error Cases', () => {
      it('should return 404 when no messages found for receiver', async () => {
        const nonExistentId = new mongoose.Types.ObjectId();

        const response = await request(app)
          .get(`/messages/receiver/${nonExistentId}`)
          .expect(404);

        expect(response.body.status).toBe('fail');
        expect(response.body.message).toBe('No messages found with that receiver ID.');
      });
    });
  });
});
