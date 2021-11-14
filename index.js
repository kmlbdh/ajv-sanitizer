const sanitizers = require('./lib/sanitizers');

const ajvSanitizer = (ajv, extraSanitizers) => {
	const extendedSanitizers = {
		...sanitizers,
		...extraSanitizers,
	};

	ajv.addKeyword('sanitize', {
		modifying: true,
		compile: function compile(schema) {
			let sanitize;

			if (typeof schema === 'string') {
				sanitize = extendedSanitizers[schema];
			}

			if (typeof schema === 'function') {
				sanitize = schema;
			}

			if (!sanitize) {
				throw new TypeError('Unknown sanitizer');
			}

			return (data, currentDataPath) => {
				const {parentDataProperty, rootData} = currentDataPath;
				if (!parentDataProperty && parentDataProperty !== 0) throw new TypeError('Data must be a property of an object');
				rootData[parentDataProperty] = sanitize(data);
				return true;
			};
		},
		errors: false,
	});

	return ajv;
};

module.exports = ajvSanitizer;
