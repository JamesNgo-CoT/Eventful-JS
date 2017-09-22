class Eventful {
	constructor() {
		Eventful.factory(this);
	}
}

Eventful.factory = function(obj) {
	const events = {};
	Object.defineProperties(obj, {
		'off': {
			configurable: false,
			enumerable: false,
			value: (eventNames, eventHandler) => {
				for (const eventName of eventNames.replace(/\s/g, '').split(',')) {
					if (events[eventName]) {
						if (eventHandler) {
							let idx;
							while ((() => idx = events[eventName].indexOf(eventHandler))() != -1) {
								if (events[eventName].length == 1) {
									delete events[eventName];
									break;
								}
								events[eventName].splice(idx, 1);
							}
						} else {
							delete events[eventName];
						}
					}
				}
			},
			writable: false
		},
		'on': {
			configurable: false,
			enumerable: false,
			value: (eventNames, eventHandler) => {
				for (const eventName of eventNames.replace(/\s/g, '').split(',')) {
					if (!events[eventName]) {
						events[eventName] = [];
					}
					events[eventName].push(eventHandler);
				}
			},
			writable: false
		},
		'trigger': {
			configurable: false,
			enumerable: false,
			value: (eventNames, ...args) => {
				const finalEventNames = (() => {
					let finalEventNames = [];
					for (const eventName of eventNames.replace(/\s/g, '').split(',')) {
						let finalEventName = '';
						const tempFinalEventNames = [];
						for (const eventNamePart of eventName.split(':')) {
							finalEventName = (finalEventName ? finalEventName + ':' : '') + eventNamePart;
							tempFinalEventNames.push(finalEventName);
						}
						finalEventNames = finalEventNames.concat(tempFinalEventNames.reverse());
					}
					return finalEventNames;
				})();
				const done = [];
				for (const eventName of finalEventNames) {
					if (events[eventName]) {
						for (const eventHandler of events[eventName]) {
							if (done.indexOf(eventHandler) == -1) {
								eventHandler.apply(this, args);
								done.push(eventHandler);
							}
						}
					}
				}
			},
			writable: false
		}
	});
}
