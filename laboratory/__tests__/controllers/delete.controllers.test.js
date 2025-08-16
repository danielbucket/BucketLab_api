const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/v1/app');
const Message = require('../../src/v1/models/message.model');
const Account = require('../../src/v1/models/account.model');

describe('DELETE Messages Controllers', () => {
  describe('DELETE /messages/delete/:id (delete_message_by_message_id)', () => {
    let senderAccount, receiverAccount, testMessage;

    beforeEach(async () => {
      // Create test accounts
      senderAccount = await Account.create({
        first_name: 'John',
        last_name: 'Sender',
        email: 'john.sender@test.com',
        password: 'password123',
        phone: '1234567890'
      });

      receiverAccount = await Account.create({
        first_name: 'Jane',
        last_name: 'Receiver',
        email: 'jane.receiver@test.com',
        password: 'password123',
        phone: '0987654321'
      });

      // Create test message
      testMessage = await Message.create({
        message: 'Test message to be deleted',
        title: 'Test Delete Title',
        sender_id: senderAccount._id,
        receiver_id: receiverAccount._id
      });
    });

    describe('Success Cases', () => {
      test('should delete message with valid ID', async () => {
        const response = await request(app)
          .delete(`/messages/delete/${testMessage._id}`)
          .expect(204);

        // Verify message was actually deleted
        const deletedMessage = await Message.findById(testMessage._id);
        expect(deletedMessage).toBeNull();
      });

      test('should return 204 with no content on successful deletion', async () => {
        const response = await request(app)
          .delete(`/messages/delete/${testMessage._id}`)
          .expect(204);

        expect(response.body).toEqual({});
      });
    });

    describe('Error Cases', () => {
      test('should return 404 when message does not exist', async () => {
        const nonExistentId = new mongoose.Types.ObjectId();
        const response = await request(app)
          .delete(`/messages/delete/${nonExistentId}`)
          .expect(404);

        expect(response.body).toEqual({
          status: 'fail',
          message: 'No message found with that ID.'
        });
      });

      test('should handle invalid ID format gracefully', async () => {
        const response = await request(app)
          .delete('/messages/delete/invalid-id-format')
          .expect(500);

        expect(response.body).toHaveProperty('status', 'error');
        expect(response.body).toHaveProperty('message');
      });

      test('should return 404 for already deleted message', async () => {
        // Delete the message first
        await Message.findByIdAndDelete(testMessage._id);

        const response = await request(app)
          .delete(`/messages/delete/${testMessage._id}`)
          .expect(404);

        expect(response.body).toEqual({
          status: 'fail',
          message: 'No message found with that ID.'
        });
      });
    });

    describe('Database Persistence', () => {
      test('should actually remove message from database', async () => {
        const messageId = testMessage._id;
        
        // Verify message exists before deletion
        const messageBeforeDelete = await Message.findById(messageId);
        expect(messageBeforeDelete).toBeTruthy();

        // Delete the message
        await request(app)
          .delete(`/messages/delete/${messageId}`)
          .expect(204);

        // Verify message no longer exists in database
        const messageAfterDelete = await Message.findById(messageId);
        expect(messageAfterDelete).toBeNull();
      });

      test('should not affect other messages when deleting', async () => {
        // Create another message
        const anotherMessage = await Message.create({
          message: 'Another test message',
          title: 'Another Test Title',
          sender_id: senderAccount._id,
          receiver_id: receiverAccount._id
        });

        // Delete the first message
        await request(app)
          .delete(`/messages/delete/${testMessage._id}`)
          .expect(204);

        // Verify the other message still exists
        const remainingMessage = await Message.findById(anotherMessage._id);
        expect(remainingMessage).toBeTruthy();
        expect(remainingMessage.message).toBe('Another test message');
      });
    });

    describe('Edge Cases', () => {
      test('should handle deletion of message with ObjectId string format', async () => {
        const messageIdString = testMessage._id.toString();
        
        const response = await request(app)
          .delete(`/messages/delete/${messageIdString}`)
          .expect(204);

        // Verify message was deleted
        const deletedMessage = await Message.findById(messageIdString);
        expect(deletedMessage).toBeNull();
      });
    });
  });
});
