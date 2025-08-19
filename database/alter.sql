-- Ο πίνακας "katagrafi" κρατάει σημαντικές κινήσεις που επιτελούν οι χρήστες.
-- Αυτές οι κινήσεις μπορεί να φανούν χρήσιμες σε περιπτώσεις όπου αναζητούμε
-- ποιος και πότε έχει διαγράψει παρουσιολόγια, ποιος και πότε έχει αλλοιώσει
-- στοιχεία των αρμοδίων ενός παρουσιολογίου κοκ.

CREATE TABLE `katagrafi` (
	`ipalilos`	MEDIUMINT UNSIGNED NOT NULL COMMENT 'Κωδικός χρήστη',
	`meraora`	DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`deltio`	MEDIUMINT UNSIGNED NOT NULL COMMENT 'Κωδικός παρουσιολογίου',
	`ipiresia`	VARCHAR(20) NOT NULL COMMENT 'Υπηρεσία παρουσιολογίου',
	`idos`		ENUM (
		'ΔΙΑΓΡΑΦΗ ΔΕΛΤΙΟΥ',
		'ΠΡΟΣΘΗΚΗ ΑΡΜΟΔΙΟΥ',
		'ΜΕΤΑΒΟΛΗ ΑΡΜΟΔΙΟΥ',
		'ΔΙΑΓΡΑΦΗ ΑΡΜΟΔΙΟΥ',
		'ΑΝΑΙΡΕΣΗ ΚΥΡΩΣΗΣ'
	) NOT NULL COMMENT 'Είδος κίνησης',
	`data`		VARCHAR(256) NOT NULL COMMENT 'Δεδομένα κίνησης',

	INDEX (
		`deltio`
	) USING HASH,

	INDEX (
		`ipiresia`,
		`meraora`
	) USING BTREE
)

COMMENT = 'Πίνακας καταγραφής σημαντικών κινήσεων'
;
