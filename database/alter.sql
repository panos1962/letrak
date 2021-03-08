ALTER TABLE `parousia`
ADD COLUMN (
	`kataxorisi`	ENUM (
		'',
		'WINPAK',
		'ΣΥΝΤΑΚΤΗΣ'
	) NOT NULL DEFAULT '' COMMENT 'Τρόπος καταχώρησης ημερομηνία και ώρας'
);
