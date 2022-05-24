# conversation

![Build Status](https://github.com/janis-commerce/handlebars/workflows/Build%20Status/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/janis-commerce/conversation/badge.svg?branch=master)](https://coveralls.io/github/janis-commerce/conversation?branch=master)
[![npm version](https://badge.fury.io/js/%40janiscommerce%2Fconversation.svg)](https://www.npmjs.com/package/@janiscommerce/conversation)

A package to send notifications using Janis Conversation Service

## Installation
```sh
npm install @janiscommerce/conversation
```

# Available methods

The methods that you can use to create the notification: (All these methods are chainable)
- **`setTopic [topic: String]`** : This method sets which template should use the notification
- **`setData [data: Object]`**: This method sets the data that eventually the template should use when sending the notification.
- **`setEntity [entity: String|Number]`**: This method sets the entity related to the notification.
- **`setEntityId [entityId: String|Number]`**: This method sets the entity ID related to the notification.
- **`setUserCreated [userCreated: String]`**: This method sets the User ID related to the user that triggered the notification.
- **`setClientCode [clientCode: String]`** This method should be used to be able to make requests "on behalf" of the client, in case the session has not been injected.
- **`send`** This method sends the notification set using the Conversation package. Returns the ID of the created message.

## ClientCode injection

The package uses the Janis Conversation Service, so it needs the `clientCode` to be able to use it's API. You have two ways to do so:

- Instanciate the package in a sessioned class using `this.session.getSessionInstance(Conversation)` (see [@janiscommerce/api-session](https://www.npmjs.com/package/@janiscommerce/api-session))
- Setting the `clientCode` using the `conversation.setClientCode('clientCode')` method

## Errors

The errors are informed with a `ConversationError`.
This object has a code that can be useful for a correct error handling or debugging.
The codes are the following:

| Code | Description                    |
|------|--------------------------------|
| 1    | Required field missing         |
| 2    | Invalid field type             |
| 3    | Microservice call Error        |

## Examples

### Client injection

#### With clientCode

```js
const { Conversation } = require('@janiscommerce/conversation');

const conversation = new Conversation();

await conversation.setTopic('example-topic')
	.setClientCode('client-code')
	.send();
```

#### With session

```js
const { Conversation } = require('@janiscommerce/conversation');
const API = require('@janiscommerce/api');

class ApiExample extends API {

	async process() {

		const conversation = this.session.getSessionInstance(Conversation);

		try {
			await conversation.setTopic('example-topic').send();
		} catch(error) {
			console.log(error);
		}
	}
}

module.exports = ApiExample;
```

## Examples

### Send a message

#### Basic usage

```js
const { Conversation } = require('@janiscommerce/conversation');

const conversation = new Conversation();

await conversation.setClientCode('client-code')
	.setTopic('example-topic')
	.send();
```

#### Complete Usage

```js
const { Conversation } = require('@janiscommerce/conversation');

const conversation = new Conversation();

await conversation.setClientCode('client-code')
	.setTopic('example-topic')
	.setEntity('order')
	.setEntityId('5de565c07de99000110dcdef')
	.setUserCreated('6de565c07de99000110dcdef')
	.setData({
		someField: 'someFieldValue',
		otherField: 'otherFieldValue'
	})
	.send();
```