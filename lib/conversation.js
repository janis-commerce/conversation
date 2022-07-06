'use strict';

const { Invoker } = require('@janiscommerce/lambda');

const ConversationValidator = require('./conversation-validator');

module.exports = class Conversation {

	constructor() {
		this._conversation = {};
	}

	/**
	 *  Sets the topic of the notification
	 *  @param topic Indicates which template uses the notification
	 * 	@returns {Conversation} The instance on which this method was called.
	 */
	setTopic(topic) {
		this._conversation.topic = topic;
		return this;
	}

	/**
	 *  Sets the data of the notification
	 *  @param data Content that the template should use when sending the notification
	 * 	@returns {Conversation} The instance on which this method was called.
	 */
	setData(data) {
		this._conversation.data = data;
		return this;
	}

	/**
	 *  Sets the entity of the notification
	 *  @param entity The entity name
	 * 	@returns {Conversation} The instance on which this method was called.
	 */
	setEntity(entity) {
		this._conversation.entity = entity;
		return this;
	}

	/**
	 *  Sets the entityId of the notification
	 * 	@param entityId The entity Id
	 * 	@returns {Conversation} The instance on which this method was called.
	 */
	setEntityId(entityId) {
		this._conversation.entityId = entityId;
		return this;
	}

	/**
	 *  Sets the user who created the message
	 * 	@param userCreated The user Id
	 * 	@returns {Conversation} The instance on which this method was called.
	 */
	setUserCreated(userCreated) {
		this._conversation.userCreated = userCreated;
		return this;
	}

	/**
	 *  Sets the clientCode that to be able to use Conversation Serice's API
	 * 	@param clientCode The client code
	 * 	@returns {Conversation} The instance on which this method was called.
	 */
	setClientCode(clientCode) {
		this.clientCode = clientCode;
		return this;
	}

	/**
	 *  Send new message to Conversation Service
	 *  @async
	 * 	@returns {Promise<object>} The lambda function response
	 */
	async send() {

		if(this.session && this.session.userId && !this._conversation.userCreated)
			this._conversation.userCreated = this.session.userId;

		this._validateConversation();

		if(!this.clientCode)
			this.clientCode = this.session.clientCode;

		return Invoker.serviceClientCall('conversation', 'SaveMessage', this.clientCode, this._conversation);
	}

	/**
	 *  Validate to make a successful request to Conversation Message Lambda function
	 */
	_validateConversation() {
		return ConversationValidator.validateFieldTypes(this);
	}
};
