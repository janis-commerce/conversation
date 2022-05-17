'use strict';

const assert = require('assert');

const sinon = require('sinon');

const MicroserviceCall = require('@janiscommerce/microservice-call');

const {
	Conversation,
	ConversationError
} = require('../lib');

const JANIS_CONVERSATION_SERVICE = 'conversation';
const JANIS_CONVERSATION_NAMESPACE = 'message';
const JANIS_CONVERSATION_METHOD = 'create';
let headers = {};

describe('Conversation', () => {

	beforeEach(() => {
		sinon.stub(MicroserviceCall.prototype, 'call');
	});

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

		it('Should throw when the MicroserviceCall throws', async () => {

			const microserviceCallError = {
				name: 'ConversationError',
				code: ConversationError.codes.MS_CALL_ERROR
			};

			MicroserviceCall.prototype.call.resolves(microserviceCallError);

			const conversation = session.getSessionInstance(Conversation);

			await assert.rejects(() => conversation
				.setTopic('new alert')
				.send(), microserviceCallError);

			sinon.assert.calledOnce(MicroserviceCall.prototype.call);

			sinon.assert.calledWithExactly(MicroserviceCall.prototype.call,
				JANIS_CONVERSATION_SERVICE,
				JANIS_CONVERSATION_NAMESPACE,
				JANIS_CONVERSATION_METHOD,
				{
					topic: 'new alert',
					userCreated: '5d1fc1eeb5b68406e0487a06'
				},
				headers
			);
		});

		it('Should send the conversation with session', async () => {

			MicroserviceCall.prototype.call.resolves({ body: { id: '5de565c07de99000110dcdef' } });

			const conversation = session.getSessionInstance(Conversation);

			const conversationData = await conversation
				.setTopic('example-topic')
				.send();

			assert.deepStrictEqual(conversationData, { id: '5de565c07de99000110dcdef' });

			sinon.assert.calledOnceWithExactly(MicroserviceCall.prototype.call,
				JANIS_CONVERSATION_SERVICE,
				JANIS_CONVERSATION_NAMESPACE,
				JANIS_CONVERSATION_METHOD,
				{
					topic: 'example-topic',
					userCreated: '5d1fc1eeb5b68406e0487a06'
				},
				headers
			);
		});

		it('Should send the conversation with a clientCode', async () => {

			MicroserviceCall.prototype.call.resolves({ body: { id: '5de565c07de99000110dcdef' } });

			const conversation = new Conversation();
			const conversationData = await conversation
				.setTopic('example-topic')
				.setClientCode('client-code')
				.send();

			assert.deepStrictEqual(conversationData, { id: '5de565c07de99000110dcdef' });

			headers = { 'janis-client': 'client-code' };

			sinon.assert.calledOnce(MicroserviceCall.prototype.call);
			sinon.assert.calledWithExactly(MicroserviceCall.prototype.call,
				JANIS_CONVERSATION_SERVICE,
				JANIS_CONVERSATION_NAMESPACE,
				JANIS_CONVERSATION_METHOD,
				{ topic: 'example-topic' },
				headers
			);
		});

		it('Should send the conversation with a custom userCreated', async () => {

			MicroserviceCall.prototype.call.resolves({ body: { id: '5de565c07de99000110dcdef' } });

			const conversation = new Conversation();
			const conversationData = await conversation
				.setTopic('example-topic')
				.setClientCode('clientCode')
				.setUserCreated('5d1fc1eeb5b68406e0487a07')
				.send();

			assert.deepStrictEqual(conversationData, { id: '5de565c07de99000110dcdef' });

			headers = { 'janis-client': 'clientCode' };

			sinon.assert.calledOnce(MicroserviceCall.prototype.call);
			sinon.assert.calledWithExactly(MicroserviceCall.prototype.call,
				JANIS_CONVERSATION_SERVICE,
				JANIS_CONVERSATION_NAMESPACE,
				JANIS_CONVERSATION_METHOD,
				{
					topic: 'example-topic',
					userCreated: '5d1fc1eeb5b68406e0487a07'
				},
				headers
			);
		});

		it('Should send the conversation with all fields set', async () => {

			MicroserviceCall.prototype.call.resolves({ body: { id: '5de565c07de99000110dcdef' } });

			const conversation = session.getSessionInstance(Conversation);

			const conversationData = await conversation
				.setTopic('example-topic')
				.setEntity('order')
				.setEntityId('6283d35eef38a7319756256a')
				.setClientCode('client-code')
				.setData({ name: 'John', surname: 'Doe' })
				.send();

			assert.deepStrictEqual(conversationData, { id: '5de565c07de99000110dcdef' });

			headers = { 'janis-client': 'client-code' };

			sinon.assert.calledOnceWithExactly(MicroserviceCall.prototype.call,
				JANIS_CONVERSATION_SERVICE,
				JANIS_CONVERSATION_NAMESPACE,
				JANIS_CONVERSATION_METHOD,
				{
					topic: 'example-topic',
					entity: 'order',
					entityId: '6283d35eef38a7319756256a',
					data: { name: 'John', surname: 'Doe' },
					userCreated: '5d1fc1eeb5b68406e0487a06'
				},
				headers
			);
		});
	});
});
