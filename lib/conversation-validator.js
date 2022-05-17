'use strict';

const ConversationError = require('./conversation-error');

module.exports = class ConversationValidator {

	constructor({ _conversation, clientCode, session }) {
		this.conversation = _conversation;
		this.clientCode = clientCode;
		this.session = session;
	}

	validateFieldTypes() {

		// Should be a string
		if(typeof this.conversation.topic !== 'undefined' && typeof this.conversation.topic !== 'string')
			throw new ConversationError('Invalid conversation: topic property must be a string', ConversationError.codes.INVALID_FIELD_TYPE);

		// Should be an object (not array)
		if(typeof this.conversation.data !== 'undefined' && typeof this.conversation.data !== 'object')
			throw new ConversationError('Invalid conversation: data property must be an object', ConversationError.codes.INVALID_FIELD_TYPE);

		// Should be a string or number
		// eslint-disable-next-line max-len
		if(typeof this.conversation.entity !== 'undefined' && (typeof this.conversation.entity !== 'string' && typeof this.conversation.entity !== 'number'))
			throw new ConversationError('Invalid conversation: entity property must be an string or number', ConversationError.codes.INVALID_FIELD_TYPE);

		// Should be a string or number
		// eslint-disable-next-line max-len
		if(typeof this.conversation.entityId !== 'undefined' && (typeof this.conversation.entityId !== 'string' && typeof this.conversation.entityId !== 'number'))
			throw new ConversationError('Invalid conversation: entityId property must be an string or number', ConversationError.codes.INVALID_FIELD_TYPE);

		// Should be a string
		if(typeof this.clientCode !== 'undefined' && typeof this.clientCode !== 'string')
			throw new ConversationError('Invalid conversation: clientCode property must be a string', ConversationError.codes.INVALID_FIELD_TYPE);

		// Should be a string
		if(typeof this.conversation.userCreated !== 'undefined' && typeof this.conversation.userCreated !== 'string')
			throw new ConversationError('Invalid conversation: userCreated property must be a string', ConversationError.codes.INVALID_FIELD_TYPE);
	}
};
