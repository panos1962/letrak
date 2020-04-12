"use strict";

const pd =
require('../../mnt/pandora/www/lib/pandoraClient.js');
require('../../mnt/pandora/www/lib/pandoraJQueryUI.js')(pd);

const letrak = require('../lib/letrak.js');

pd.domInit(() => {
	pd.
	domSetup().
	toolbarSetup().
	fyiSetup().
	ofelimoSetup().
	ribbonSetup();

	imerisio.
	selidaSetup().
	noop();
});

///////////////////////////////////////////////////////////////////////////////@

const imerisio = {};

imerisio.noop = () => imerisio;

imerisio.selidaSetup = () => {
	imerisio.
	toolbarSetup().
	noop();

	return imerisio;
};

imerisio.toolbarSetup = () => {
	pd.toolbarRightDOM.
	append(imerisio.isodosTab());

	pd.domFixup();
	return imerisio;
};

///////////////////////////////////////////////////////////////////////////////@

imerisio.isodosTab = () => {
	let tabDOM = pd.tabDOM().
	css('cursor', 'pointer');

	if (pd.noXristis()) {
		tabDOM.append('Είσοδος');
		return tabDOM;
	}

	tabDOM.append('xxxxxxxxx');
	return tabDOM;
};
