-------------------------------------------------------------------------------@
--
-- @BEGIN
--
-- @COPYRIGHT BEGIN
-- Copyright (C) 2020 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
-- @COPYRIGHT END
--
-- @FILETYPE BEGIN
-- SQL
-- @FILETYPE END
--
-- @FILE BEGIN
-- database/letrak.sql —— Data dictionary for database "letrak"
-- @FILE END
--
-- @HISTORY BEGIN
-- Created: 2020-04-08
-- @HISTORY END
--
-- @END
--
-------------------------------------------------------------------------------@

\! [ -w /dev/tty ] && echo "\nDatabase '[[DATABASE]]'" >/dev/tty >/dev/tty

-------------------------------------------------------------------------------@

\! [ -w /dev/tty ] && echo "Creating database…" >/dev/tty

-- Πρώτο βήμα είναι η διαγραφή της database εφόσον αυτή υπάρχει ήδη.

DROP DATABASE IF EXISTS `[[DATABASE]]`
;

-- Με το παρόν κατασκευάζουμε την database.

CREATE DATABASE `[[DATABASE]]`
DEFAULT CHARSET = utf8
DEFAULT COLLATE = utf8_general_ci
;

-- Καθιστούμε τρέχουσα την database που μόλις κατασκευάσαμε.

USE `[[DATABASE]]`
;

-- Καθορίζουμε την default storage engine για τους πίνακες που θα δημιουργηθούν.

SET default_storage_engine = INNODB
;

-------------------------------------------------------------------------------@

CREATE TABLE `adidos` (
	`kodikos`	SMALLINT UNSIGNED NOT NULL COMMENT 'Είδος αδείας',
	`perigrafi`	VARCHAR(128) NOT NULL COMMENT 'Περιγραφή είδους αδείας',
	`taxinomisi`	SMALLINT NOT NULL COMMENT 'Ταξινομικός κωδικός',

	PRIMARY KEY (
		`kodikos`
	) USING HASH
)

COMMENT = 'Πίνακας ειδών αδείας'
;

CREATE TABLE `imerisio` (
	`kodikos`	MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Κωδικός παρουσιολογίου',

	-- Ακολουθεί ο κωδικός προτύπου παρουσιολογίου, δηλαδή ο κωδικός του
	-- παρουσιολογίου που χρησιμοποιήθηκε ως πρότυπο για το ανά χείρας
	-- παρουσιολόγιο. Πράγματι, κάθε παρουσιολόγιο δημιουργείται αρχικά
	-- ως αντίγραφο σχετικού παρουσιολογίου προηγούμενης ημερομηνίας,
	-- όσον αφορά στις περιγραφές, στις υπογραφές, στους υπαλλήλους που
	-- συμμετέχουν και γενικά σε ό,τι δεν αφορά τις ώρες προσέλευσης και
	-- αποχώρησης. Υπάρχει περίπτωση κάποιο παρουσιολόγιο να δημιουργηθεί
	-- με αντιγραφή προτύπου περισσότερες από μία φορές, πράγμα που μάλλον
	-- θα συμβεί κατά λάθος· κρατώντας τον κωδικό προτύπου καθίσταται
	-- δυνατός ο έλεγχος πολλαπλής αντιγραφής προτύπου.

	`protipo`	MEDIUMINT UNSIGNED NULL DEFAULT NULL COMMENT 'Κωδικός προτύπου',
	`imerominia`	DATE NOT NULL COMMENT 'Ημερομηνία',
	`ipiresia`	VARCHAR(20) NULL DEFAULT NULL COMMENT 'Αρμόδια υπηρεσία',
	`prosapo`	ENUM (
		'ΠΡΟΣΕΛΕΥΣΗ',
		'ΑΠΟΧΩΡΗΣΗ'
	) NULL DEFAULT NULL COMMENT 'Είδος παρουσιολογίου',
	`perigrafi`	VARCHAR(128) NULL DEFAULT NULL COMMENT 'Περιγραφή',
	`closed`	DATETIME NULL DEFAULT NULL COMMENT 'Ημερομηνία και ώρα κλεισίματος',

	PRIMARY KEY (
		`kodikos`
	) USING HASH,

	INDEX (
		`imerominia`,
		`ipiresia`
	) USING BTREE
)

COMMENT = 'Πίνακας παρουσιολογίων'
;

CREATE TABLE `ipografi` (
	`imerisio`	MEDIUMINT UNSIGNED NOT NULL COMMENT 'Παρουσιολόγιο',
	`taxinomisi`	TINYINT UNSIGNED NOT NULL COMMENT 'Τάξη υπογραφής',
	`titlos`	VARCHAR(64) NULL DEFAULT NULL COMMENT 'Τίτλος αρμοδίου',
	`armodios`	MEDIUMINT UNSIGNED NOT NULL COMMENT 'Αρμόδιος υπάλληλος',

	UNIQUE INDEX (
		`imerisio`,
		`taxinomisi`
	) USING BTREE
)

COMMENT = 'Πίνακας υπογραφών παρουσιολογίου'
;

CREATE TABLE `parousia` (
	`imerisio`	MEDIUMINT UNSIGNED NOT NULL COMMENT 'Παρουσιολόγιο',
	`ipalilos`	MEDIUMINT UNSIGNED NOT NULL COMMENT 'Υπάλληλος',
	`meraora`	DATETIME NULL DEFAULT NULL COMMENT 'Ημερομηνία και ώρα προσέλευσης/αποχώρησης',

	UNIQUE INDEX (
		`imerisio`,
		`ipalilos`
	) USING BTREE
)

COMMENT = 'Πίνακας εγγραφών παρουσιολογίου'
;

CREATE TABLE `adia` (
	`ipalilos`	MEDIUMINT UNSIGNED NOT NULL COMMENT 'Κωδικός υπαλλήλου',
	`idos`		SMALLINT UNSIGNED NOT NULL COMMENT 'Είδος αδείας',
	`apo`		DATE NOT NULL COMMENT 'Ημερομηνία έναρξης αδείας',
	`eos`		DATE NULL DEFAULT NULL COMMENT 'Ημερομηνία λήξης αδείας',

	UNIQUE INDEX (
		`ipalilos`,
		`apo`
	) USING BTREE
)

COMMENT = 'Πίνακας αδειών υπαλλήλων'
;

CREATE TABLE `excuse` (
	`imerisio`	MEDIUMINT UNSIGNED NOT NULL COMMENT 'Παρουσιολόγιο',
	`ipalilos`	MEDIUMINT UNSIGNED NOT NULL COMMENT 'Υπάλληλος',
	`karta`		MEDIUMINT UNSIGNED NULL DEFAULT NULL COMMENT 'Αριθμός κάρτας',
	`logos`		ENUM (
		'ΕΚΤΟΣ',
		'ΑΙΜΟΔΟΣΙΑ',
		'ΕΟΡΤΗ',
		'ΥΓΕΙΑ',
		'ΠΕΝΘΟΣ',
		'ΑΝΑΓΚΗ'
	) NULL DEFAULT NULL COMMENT 'Λόγος μη καταγραφής ώρας',
	`info`		VARCHAR(4096) NULL DEFAULT NULL COMMENT 'Εκτενής τεκμηρίωση εξαίρεσης',

	UNIQUE INDEX (
		`imerisio`,
		`ipalilos`
	) USING BTREE
)

COMMENT = 'Πίνακας εξαιρέσεων καταγραφής ώρας προσέλευσης/αποχώρησης'
;

COMMIT WORK
;

-------------------------------------------------------------------------------@

\! [ -w /dev/tty ] && echo "Creating relations…" >/dev/tty

ALTER TABLE `ipografi` ADD FOREIGN KEY (
	`imerisio`
) REFERENCES `imerisio` (
	`kodikos`
) ON UPDATE CASCADE ON DELETE CASCADE
;

ALTER TABLE `parousia` ADD FOREIGN KEY (
	`imerisio`
) REFERENCES `imerisio` (
	`kodikos`
) ON UPDATE CASCADE ON DELETE CASCADE
;

ALTER TABLE `excuse` ADD FOREIGN KEY (
	`imerisio`
) REFERENCES `imerisio` (
	`kodikos`
) ON UPDATE CASCADE ON DELETE CASCADE
;

COMMIT WORK
;

-------------------------------------------------------------------------------@

\! [ -w /dev/tty ] && echo "Creating users…" >/dev/tty

DROP USER IF EXISTS '[[USERNAME]]'@'[[HOST]]'
;

CREATE USER '[[USERNAME]]'@'[[HOST]]' IDENTIFIED BY '[[USERPASS]]'
;

COMMIT WORK
;

-------------------------------------------------------------------------------@

\! [ -w /dev/tty ] && echo "Granting permissions…" >/dev/tty

GRANT SELECT, INSERT, UPDATE, DELETE
ON `[[DATABASE]]`.* TO '[[USERNAME]]'@'[[HOST]]'
;

GRANT SELECT
ON `[[KARTELDB]]`.* TO '[[USERNAME]]'@'[[HOST]]'
;

COMMIT WORK
;

-------------------------------------------------------------------------------@
