'use strict';

const MicroserviceCall = require('@janiscommerce/microservice-call');

const ConversationError = require('./conversation-error');
const ConversationValidator = require('./conversation-validator');

const JANIS_CONVERSATION_SERVICE = 'conversation';
const JANIS_CONVERSATION_NAMESPACE = 'message';
const JANIS_CONVERSATION_METHOD = 'create';

module.exports = class Conversation {

	get conversationService() {
		return JANIS_CONVERSATION_SERVICE;
	}

	get conversationNamespace() {
		return JANIS_CONVERSATION_NAMESPACE;
	}

	get conversationMethod() {
		return JANIS_CONVERSATION_METHOD;
	}

	constructor() {
		this._conversation = {};
	}

	setTopic(topic) {
		this._conversation.topic = topic;
		return this;
	}

	setData(data) {
		this._conversation.data = data;
		return this;
	}

	setEntity(entity) {
		this._conversation.entity = entity;
		return this;
	}

	setEntityId(entityId) {
		this._conversation.entityId = entityId;
		return this;
	}

	setUserCreated(userCreated) {
		this._conversation.userCreated = userCreated;
		return this;
	}

	setClientCode(clientCode) {
		this.clientCode = clientCode;
		return this;
	}

	async send() {

		if(this.session && this.session.userId && !this._conversation.userCreated)
			this._conversation.userCreated = this.session.userId;

		this._validateConversation();

		const ms = this.session ? this.session.getSessionInstance(MicroserviceCall) : new MicroserviceCall();

		const headers = {};

		if(this.clientCode)
			headers['janis-client'] = this.clientCode;

		try {

			const response = await ms.call(this.conversationService, this.conversationNamespace, this.conversationMethod, this._conversation, headers);

			return {
				id: response.body.id
			};

		} catch(err) {
			throw new ConversationError(err, ConversationError.codes.MS_CALL_ERROR);
		}
	}

	_validateConversation() {
		return ConversationValidator.validateFieldTypes(this);
	}
};
