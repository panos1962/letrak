"use strict";

const pnd =
require('../mnt/pandora/lib/pandora.js');
require('../mnt/pandora/lib/pandoraJQueryUI.js')(pnd);
const letrak =
require('../lib/letrak.js');
const imerisio = {};

pnd.domInit(() => {
	pnd.
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

imerisio.noop = () => imerisio;

imerisio.selidaSetup = () => {
	imerisio.
	toolbarSetup().
	noop();

	pnd.domFixup();
	return imerisio;
};

imerisio.toolbarSetup = () => {
	letrak.
	toolbarCenterSetup().
	xristisSetup();

	return imerisio;
};

///////////////////////////////////////////////////////////////////////////////@
