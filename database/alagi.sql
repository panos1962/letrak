USE `letrak`
;

CREATE TABLE `xparam` (
	`ipalilos`	MEDIUMINT UNSIGNED NOT NULL COMMENT 'Υπάλληλος',
	`param` ENUM (
		'ΤΑΞΙΝΟΜΗΣΗ ΔΕΛΤΙΩΝ',
		'ΟΜΑΔΟΠΟΙΗΣΗ ΔΕΛΤΙΩΝ'
	) NOT NULL COMMENT 'Είδος παραμέτρου',
	`timi` VARCHAR(1024) NULL DEFAULT NULL COMMENT 'Τιμή παραμέτρου',

	PRIMARY KEY (
		`ipalilos`,
		`param`
	) USING BTREE
)

COMMENT = 'Παράμετροι υπαλλήλων ως χρηστών εφαρμογής παρουσιολογίων'
;
