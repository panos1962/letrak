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
			let href = self.location.href;
			e.stopPropagation();
			$.post({
				'url': '../mnt/pandora/lib/session.php',
				'data': {
					'list': php._POST,
				},
			});

			self.location = '/letrak/isodos?url=' +
				encodeURIComponent(self.location.href);
		}));
	}

	return imerisio;
};

///////////////////////////////////////////////////////////////////////////////@
