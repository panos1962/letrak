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
		pd.toolbarRightDOM.
		append(pd.tabDOM().
		append('Είσοδος').
		css('cursor', 'pointer').
		on('click', (e) => {
			e.stopPropagation();
			self.location = '/letrak/isodos';
		}));
	}

	else {
		pd.toolbarRightDOM.
		append(pd.tabDOM().
		append('Έξοδος').
		css('cursor', 'pointer').
		on('click', (e) => {
			e.stopPropagation();

			let list = {};
			list[php.defs['LETRAK_SESSION_IPALILOS']] = undefined;

			$.post({
				'url': '../mnt/pandora/lib/session.php',
				'data': {
					'unset': true,
					'list': list,
				},
				'success': () => $.noop(),
				//'success': () => self.location = '/letrak/imerisio',
				'error': (e) => {
					pd.fyiError('Αδυναμία εξόδου');
					console.error(e);
				},
			});
		}));
	}

	return imerisio;
};

///////////////////////////////////////////////////////////////////////////////@
