'use strict';

const assert = require('assert');

const sinon = require('sinon');

const { Invoker } = require('@janiscommerce/lambda');

const {
	Conversation,
	ConversationError
} = require('../lib');

describe('Conversation', () => {

	afterEach(() => {
		sinon.restore();
	});

	const prepareErrorData = (code, message) => {
		return {
			name: 'ConversationError',
			message,
			code
		};
	};

	const session = {
		userId: '5d1fc1eeb5b68406e0487a06',
		userIsDev: true,
		clientId: '5d1fc1eeb5b68406e0487a07',
		clientCode: 'fizzmodarg',
		profileId: '5d1fc1eeb5b68406e0487a08',
		permissions: [],
		getSessionInstance: TheClass => {
			const instance = new TheClass();
			instance.session = session;
			return instance;
		}
	};

	const assertSaveConversation = (data, clientCode) => {
		sinon.assert.calledOnceWithExactly(Invoker.serviceClientCall, 'conversation', 'SaveMessage', clientCode, data);
	};

	describe('Conversation structure field types', () => {

		it('Should throw when the value \'topic\' are not a string or array', async () => {

			const conversation = new Conversation();

			const conversationData = conversation
				.setTopic({ wrongField: 'string' })
				.setClientCode('clientCode')
				.send();

			await assert.rejects(conversationData,
				prepareErrorData(ConversationError.codes.INVALID_FIELD_TYPE, 'Invalid conversation: topic property must be a string'));
		});

		it('Should throw when the value \'data\' are not an object', async () => {

			const conversation = new Conversation();

			const conversationData = conversation
				.setTopic('example-topic')
				.setClientCode('clientCode')
				.setData('WrongData')
				.send();

			await assert.rejects(conversationData,
				prepareErrorData(ConversationError.codes.INVALID_FIELD_TYPE, 'Invalid conversation: data property must be an object'));
		});

		it('Should throw when the value \'entity\' are not a string or number', async () => {

			const conversation = new Conversation();

			const conversationData = conversation
				.setTopic('example-topic')
				.setClientCode('clientCode')
				.setEntity({ entity: 'wrongType' })
				.send();

			await assert.rejects(conversationData,
				prepareErrorData(ConversationError.codes.INVALID_FIELD_TYPE, 'Invalid conversation: entity property must be an string or number'));
		});

		it('Should throw when the value \'entityId\' are not a string or number', async () => {

			const conversation = new Conversation();

			const conversationData = conversation
				.setTopic('example-topic')
				.setClientCode('clientCode')
				.setEntityId({ entityId: 'wrongType' })
				.send();

			await assert.rejects(conversationData,
				prepareErrorData(ConversationError.codes.INVALID_FIELD_TYPE, 'Invalid conversation: entityId property must be an string or number'));
		});

		it('Should throw when the value of \'clientCode\' is not a string', async () => {

			const conversation = new Conversation();

			const conversationData = conversation
				.setTopic('example-topic')
				.setClientCode({ clientCode: 'wrongType' })
				.send();

			await assert.rejects(conversationData,
				prepareErrorData(ConversationError.codes.INVALID_FIELD_TYPE, 'Invalid conversation: clientCode property must be a string'));
		});

		it('Should throw when the value of \'userCreated\' is not a string', async () => {

			const conversation = new Conversation();

			const conversationData = conversation
				.setTopic('example-topic')
				.setUserCreated({ userCreated: 'wrongType' })
				.send();

			await assert.rejects(conversationData,
				prepareErrorData(ConversationError.codes.INVALID_FIELD_TYPE, 'Invalid conversation: userCreated property must be a string'));
		});
	});

	describe('Send conversation through the microserviceCall package', () => {

		it('Should throw when the Invoker throws', async () => {

			const conversation = new Conversation();

			sinon.stub(Invoker, 'serviceClientCall')
				.resolves({ message: 'Internal Conversation Error' });

			const conversationData = await conversation
				.setTopic('new alert')
				.setClientCode('clientCode')
				.send();

			assert.deepStrictEqual(conversationData, { message: 'Internal Conversation Error' });

			assertSaveConversation({ topic: 'new alert' }, 'clientCode');
		});

		it('Should send the conversation with session', async () => {

			const conversation = session.getSessionInstance(Conversation);

			sinon.stub(Invoker, 'serviceClientCall')
				.resolves({ id: '5de565c07de99000110dcdef' });

			const conversationData = await conversation
				.setTopic('example-topic')
				.send();

			assert.deepStrictEqual(conversationData, { id: '5de565c07de99000110dcdef' });

			assertSaveConversation({ topic: 'example-topic', userCreated: session.userId }, session.clientCode);
		});

		it('Should send the conversation with a clientCode', async () => {

			const conversation = new Conversation();

			sinon.stub(Invoker, 'serviceClientCall')
				.resolves({ id: '5de565c07de99000110dcdef' });

			const conversationData = await conversation
				.setTopic('example-topic')
				.setClientCode('client-code')
				.send();

			assert.deepStrictEqual(conversationData, { id: '5de565c07de99000110dcdef' });

			assertSaveConversation({ topic: 'example-topic' }, 'client-code');
		});

		it('Should send the conversation with a custom userCreated', async () => {

			const conversation = new Conversation();

			sinon.stub(Invoker, 'serviceClientCall')
				.resolves({ id: '5de565c07de99000110dcdef' });

			const conversationData = await conversation
				.setTopic('example-topic')
				.setClientCode('clientCode')
				.setUserCreated('5d1fc1eeb5b68406e0487a07')
				.send();

			assert.deepStrictEqual(conversationData, { id: '5de565c07de99000110dcdef' });

			assertSaveConversation({ topic: 'example-topic', userCreated: '5d1fc1eeb5b68406e0487a07' }, 'clientCode');
		});

		it('Should send the conversation with all fields set', async () => {

			const conversation = session.getSessionInstance(Conversation);

			sinon.stub(Invoker, 'serviceClientCall')
				.resolves({ id: '5de565c07de99000110dcdef' });

			const conversationData = await conversation
				.setTopic('example-topic')
				.setEntity('order')
				.setEntityId('6283d35eef38a7319756256a')
				.setClientCode('client-code')
				.setData({ name: 'John', surname: 'Doe' })
				.send();

			assert.deepStrictEqual(conversationData, { id: '5de565c07de99000110dcdef' });

			assertSaveConversation({
				topic: 'example-topic',
				entity: 'order',
				entityId: '6283d35eef38a7319756256a',
				data: { name: 'John', surname: 'Doe' },
				userCreated: '5d1fc1eeb5b68406e0487a06'
			}, 'client-code');
		});
	});
});
