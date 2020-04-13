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

	pd.domFixup();
	return imerisio;
};

imerisio.toolbarSetup = () => {
	if (letrak.noXristis()) {
		let pubkey = php.requestGet('pubkey');

		if (!pubkey)
		return imerisio;

		pd.toolbarRightDOM.
		append(pd.tabDOM().
		append('Είσοδος').
		css('cursor', 'pointer').
		on('click', (e) => {
			e.stopPropagation();
			self.location = '/kartel/isodos?pubkey=' + php.requestGet('pubkey');
		}));
	}

	return imerisio;
};

///////////////////////////////////////////////////////////////////////////////@
