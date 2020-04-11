"use strict";

const pd =
require('../../mnt/pandora/www/lib/pandoraClient.js');
require('../../mnt/pandora/www/lib/pandoraJQueryUI.js')(pd);

const letrak = require('../lib/letrak.js');

pd.domInit(() => {
	imerisio.
	selidaSetup().
	noop();
});

///////////////////////////////////////////////////////////////////////////////@

const imerisio = {};

imerisio.noop = () => imerisio;

imerisio.selidaSetup = () => {
	pd.
	toolbarSetup().
	fyiSetup().
	ofelimoSetup().
	ribbonSetup();

	imerisio.
	toolbarSetup().
	noop();

	return imerisio;
};

imerisio.toolbarSetup = () => {
	pd.toolbarRightDOM.
	append(pd.tabDOM().append('xxx'));

	return imerisio;
};
