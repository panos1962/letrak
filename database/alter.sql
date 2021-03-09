USE `letrak`
;

ALTER TABLE `parousia`
ADD COLUMN (
	`kataxorisi`	ENUM (
		'WINPAK',
		'ΣΥΝΤΑΚΤΗΣ'
	) NULL DEFAULT NULL COMMENT 'Τρόπος καταχώρησης ημερομηνίας και ώρας'
);
