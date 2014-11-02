var igeClientConfig = {
	include: [
		/* Your custom game JS scripts */
		'./gameClasses/Money.js',
		'./gameClasses/Bitcoins.js',
		'./gameClasses/Placement.js',
		'./gameClasses/Saving.js',
		/* Standard game scripts */
		'./client.js',
		'./index.js'
	]
};

if (typeof(module) !== 'undefined' && typeof(module.exports) !== 'undefined') { module.exports = igeClientConfig; }