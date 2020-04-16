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
php._POST['aaa'] = 'This is aaa';
php._POST['bbb'] = {
	'x': 1,
	'y': 2,
};
			e.stopPropagation();

			let list = {};
			list[php.defs.PANDORA_SESSION_POST] = JSON.stringify(php._POST);
			list[php.defs.PANDORA_SESSION_HREF] = self.location.href;

			$.post({
				'url': '../mnt/pandora/lib/session.php',
				'data': { 'list': list },
				'success': () => self.location = '/letrak/isodos',
				'error': (e) => {
					pd.fyiError('Αδυναμία μετάβασης στη φόρμα εισόδου');
					console.error(e);
				},
			});
		}));
	}

	return imerisio;
};

///////////////////////////////////////////////////////////////////////////////@
