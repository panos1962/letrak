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
	let ipalilos = letrak.isXristis();

	if (!ipalilos) {
		pd.toolbarRightDOM.
		append(pd.tabDOM().
		append('Είσοδος').
		on('click', (e) => {
			e.stopPropagation();
			self.location = '/letrak/isodos';
		}));

		return imerisio;
	}

	ipalilos = JSON.parse(ipalilos);

	if (ipalilos.prosvasi)
	pd.toolbarRightDOM.
	append(pd.tabDOM().
	html(ipalilos.prosvasi));

	if (ipalilos.ipiresia)
	pd.toolbarRightDOM.
	append(pd.tabDOM().
	html(ipalilos.ipiresia));

	pd.toolbarRightDOM.
	append(pd.tabDOM().
	html(ipalilos.kodikos + ' ' + ipalilos.onomateponimo)).
	append(pd.tabDOM().
	text('Έξοδος').
	on('click', (e) => {
		e.stopPropagation();

		let list = {};
		list[php.defs['LETRAK_SESSION_IPALILOS']] = true;

		$.post({
			'url': '../mnt/pandora/lib/session.php',
			'data': {
				'unset': true,
				'list': list,
			},
			'success': () => self.location = '/letrak/imerisio',
			'error': (e) => {
				pd.fyiError('Αδυναμία εξόδου');
				console.error(e);
			},
		});
	}));

	return imerisio;
};

///////////////////////////////////////////////////////////////////////////////@
