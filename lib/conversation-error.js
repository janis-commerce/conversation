'use strict';

class ConversationError extends Error {

	static get codes() {

		return {
			REQUIRED_FIELD_MISSING: 1,
			INVALID_FIELD_TYPE: 2,
			MS_CALL_ERROR: 3
		};

	}

	constructor(err, code) {
		super(err);
		this.message = err.message || err;
		this.code = code;
		this.name = 'ConversationError';
	}
}

module.exports = ConversationError;
