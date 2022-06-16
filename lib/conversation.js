'use strict';

const { Invoker } = require('@janiscommerce/lambda');

const ConversationValidator = require('./conversation-validator');

module.exports = class Conversation {

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

		if(!this.clientCode)
			this.clientCode = this.session.clientCode;


		const result = await Invoker.serviceClientCall('conversation', 'SaveMessage', this.clientCode, this._conversation);

		return result;
	}

	_validateConversation() {
		return ConversationValidator.validateFieldTypes(this);
	}
};
