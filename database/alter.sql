USE `letrak`
;

CREATE TABLE `orario` (
	`ipalilos`	MEDIUMINT UNSIGNED NOT NULL COMMENT 'Υπάλληλος',
	`orario`	CHAR(11) NOT NULL COMMENT 'Ωράριο',

	UNIQUE INDEX (
		`ipalilos`,
		`orario`
	) USING BTREE
)

COMMENT = 'Πίνακας ωραρίων υπαλλήλων'
;
