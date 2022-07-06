'use strict';

const ConversationError = require('./conversation-error');
const isUndefined = require('../lib/helpers/is-undefined');

module.exports = class ConversationValidator {

	static validateFieldTypes({ _conversation, clientCode }) {

		// Should be a string
		if(!isUndefined(_conversation.topic) && typeof _conversation.topic !== 'string')
			throw new ConversationError('Invalid conversation: topic property must be a string', ConversationError.codes.INVALID_FIELD_TYPE);

		// Should be an object (not array)
		if(!isUndefined(_conversation.data) && typeof _conversation.data !== 'object')
			throw new ConversationError('Invalid conversation: data property must be an object', ConversationError.codes.INVALID_FIELD_TYPE);

		// Should be a string or number
		if(!isUndefined(_conversation.entity) && (typeof _conversation.entity !== 'string' && typeof _conversation.entity !== 'number'))
			throw new ConversationError('Invalid conversation: entity property must be an string or number', ConversationError.codes.INVALID_FIELD_TYPE);

		// Should be a string or number
		if(!isUndefined(_conversation.entityId) && (typeof _conversation.entityId !== 'string' && typeof _conversation.entityId !== 'number'))
			throw new ConversationError('Invalid conversation: entityId property must be an string or number', ConversationError.codes.INVALID_FIELD_TYPE);

		// Should be a string
		if(!isUndefined(clientCode) && typeof clientCode !== 'string')
			throw new ConversationError('Invalid conversation: clientCode property must be a string', ConversationError.codes.INVALID_FIELD_TYPE);

		// Should be a string
		if(!isUndefined(_conversation.userCreated) && typeof _conversation.userCreated !== 'string')
			throw new ConversationError('Invalid conversation: userCreated property must be a string', ConversationError.codes.INVALID_FIELD_TYPE);
	}
};
