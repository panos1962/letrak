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
-- @DESCRIPTION BEGIN
-- Το παρόν file περιέχει το schema της database "letrak". Η database "letrak"
-- αφορά στα ημερήσια παρουσιολόγια που συντάσσουν οι διάφορες υπηρεσίες του
-- Δήμου Θεσσαλονίκης και υποβάλλουν στη Διεύθυνση Προσωπικού η οποία είναι
-- αρμόδια για την παρακολούθηση της τήρησης του ωραρίου από τους υπαλλήλους.
-- Πιο συγκεκριμένα, κάθε υπάλληλος πρέπει να προσέρχεται στην Υπηρεσία στην
-- οποία εργάζεται σε συγκεκριμένη ώρα κάθε εργάσιμη ημέρα και να αποχωρεί
-- όχι νωρίτερα από την προβλεπόμενη ώρα. Προφανώς στη σύνταξη των ημερήσιων
-- παρουσιολογίων εμπλέκονται οι άδειες που δικαιούνται οι εργαζόμενοι, καθώς
-- επίσης και άλλες περιπτώσεις μη κανονικής προσέλευσης ή αποχώρησης των
-- υπαλλήλων όταν υπάρχουν συγκεκριμένοι υπηρεσιακοί λόγοι, π.χ. εργασία σε
-- απομεμακρυσμένο site του Δήμου, ή ακόμη και λόγοι προσωπικοί, π.χ. ατύχημα,
-- αιμοδοσία κλπ.
--
-- Το schema της database "letrak" υπακούει σε ορισμένους βασικούς κανόνες που
-- συνοψίζονται στα εξής:
--
--	⚫ Κάθε υπηρεσιακή μονάδα του Δήμου Θεσσαλονίκης απασχολεί συγκεκριμένες
--	  ομάδες υπαλλήλων, η δομή των οποίων αλλάζει σχετικά σπάνια. Με άλλα
--	  λόγια, οι υπάλληλοι του Δήμου Θεσσαλονίκης δεν μετακινούνται από
--	  υπηρεσία σε υπηρεσία σε καθημερινή βάση, αλλά παραμένουν στις θέσεις
--	  τους για αρκετά μεγάλα χρονικά διαστήματα.
--
--	⚫ Οι Υπηρεσίες του Δήμου συντάσσουν δύο παρουσιολόγια σε ημερήσια βάση,
--	  ένα για την προσέλευση και ένα για την αποχώρηση των υπαλλήλων. Κάθε
--	  παρουσιολόγιο αφορά σε συγκεκριμένη ομάδα υπαλλήλων, όπου κάθε ομάδα
--	  αφορά σε υπαλλήλους με κονά χαρακτηριστικά όσον αφορά στη σχέση
--	  εργασίας τους με το Δήμο.
--
--	⚫ Κάθε παρουσιολόγιο δημιουργείται με βάση το αντίστοιχο παρουσιολόγιο
--	  της προηγούμενης εργάσιμης ημέρας, π.χ. το παρουσιολόγιο προσέλευσης
--	  των τακτικών υπαλλήλων του Τμήματος Μηχανογραφικής Υποστήριξης τής
--	  Διεύθυνσης ΤΠΕ για το πρωινό της 9ης Απριλίου 2020, χρησιμοποιεί ως
--	  πρότυπο το αντίστοιχο παρουσιολόγιο της 8ης Απριλίου 2020.
--
--	⚫ Τα παρουσιολόγια κάθε οργανικής μονάδας δημιουργούνται από αρμοδίους
--	  υπαλλήλους που ανήκουν κατά κανόνα στο οικείο Τμήμα Διοικητικής
--	  Υποστήριξης και κατόπιν διορθώνονται, επικαιροποιούνται και
--	  συμπληρώνονται από τον αρμόδιο προϊστάμενο ο οποίος ονομάζεται και
--	  «συντάξας».
--
--	⚫ Μετά το πέρας της σύνταξης του παρουσιολογίου, ο συντάξας «υπογράφει»
--	  και το παρουσιολόγιο τίθεται στη διάθεση του επόμενου υπογράφοντα που
--	  είναι συνήθως ο προϊστάμενος της οικείας Διεύθυνσης.
--
--	⚫ Μετά την υπογραφή του παρουσιολογίου από αυτούς που φέρουν την ευθύνη
--	  της σύνταξης και του ελέγχου των στοιχείων που αναγράφονται σε αυτό,
--	  το παρουσιολόγιο θεωρείται έτοιμο για παραλαβή από τη Διεύθυνση
--	  Προσωπικού.
-- @DESCRIPTION END
--
-- @HISTORY BEGIN
-- Updated: 2020-05-15
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

-- Ο πίνακας "deltio" περιέχει τα ημερήσια φύλλα παρουσίας τα οποία για
-- συντομία θα ονομάζουμε «παρουσιολόγια». Κάθε ένα παρουσιολόγιο αφορά σε
-- συγκεκριμένη ημερομηνία και σε συγκεκριμένη ομάδα υπαλλήλων. Σε κάθε
-- ημερομηνία μπορούν να υπάρχουν περισσότερα από ένα παρουσιολόγια για την
-- ίδια ομάδα· μάλιστα αυτό είναι το σύνηθες, καθώς για τις περισσότερες
-- υπηρεσίες συντάσσονται δύο παρουσιολόγια σε καθημερινή βάση, ένα για την
-- προσέλευση και ένα για την αποχώρηση των υπαλλήλων κάθε ομάδας.
--
-- Προκειμένου να αποσαφηνιστεί ακόμη καλύτερα η έννοια του παρουσιολογίου θα
-- παραθέσουμε μερικά παραδείγματα που αφορούν στη Διεύθυνση ΤΠΕ. Η εν λόγω
-- διεύθυνση έχει τα εξής τμήματα: Τμήμα Διοικητικής Υποστήριξης, Τμήμα
-- Ελέγχου Ποιότητας Υπηρεσιών, Τμήμα Επιχειρησιακού Προγραμματισμού, Τμήμα
-- Μηχανογραφικής Υποστήριξης και Τμήμα Ηλεκτρονικής Διακυβέρνησης.
--
-- Θα περιορίσουμε τα παραδείγματά μας στα τμήματα Διοικητικής Υποστήριξης και
-- Μηχανογραφικής Υποστήριξης, υποθέτοντας ότι το Τμήμα Διοικητικής Υποστήριξης
-- απασχολεί 5 μονίμους υπαλλήλους, ενώ το Τμήμα Μηχανογραφικής Υποστήριξης
-- απασχολεί 20 υπαλλήλους μονίμους και αορίστου χρόνου, 2 υπαλλήλους πρακτικής
-- άσκησης, έναν εκπαιδευόμενο ΕΠΑΛ και έναν με καθεστώς κοινωφελούς εργασίας.
--
-- Είναι ξεκάθαρο ότι το Τμήμα Διοικητικής Υποστήριξης θα συντάσσει καθημερινά
-- δύο παρουσιολόγια, ένα για την προσέλευση και ένα για την αποχώρηση των
-- υπαλλήλων του Τμήματος. Δεν ισχύει όμως το ίδιο για το Τμήμα Μηχανογραφικής
-- Υποστήριξης, καθώς εκεί μπορούν να συντάσσονται τέσσερα παρουσιολόγια για
-- την προσέλευση και άλλα τέσσερα για την αποχώρηση των υπαλλήλων κάθε ομάδας.
-- Με τα παραπάνω γίνεται σαφές ότι ο ορθός ορισμός των ομάδων είναι κομβικής
-- σημασίας για την καλή και γόνιμη χρήση των εφαρμογών, επομένως η διαδικασία
-- ορισμού των ομάδων υπαλλήλων κάθε Υπηρεσίας θα πρέπει να ανατίθεται σε
-- υπαλλήλους με ιδιαίτερες οργανωτικές ικανότητες. Εξάλλου, πρόκειται για
-- εργασία που δεν γίνεται σε καθημερινή βάση, αλλά μόνον μετά από σοβαρές
-- διαρθρωτικές αλλαγές, π.χ. αλλαγή οργανισμού, προσλήψεις με ιδιαίτερο
-- καθεστώς όπως ήταν τα προγράμματα STAGE, η κοινωφελής εργασία, κλπ.

CREATE TABLE `deltio` (
	`kodikos`	MEDIUMINT UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'Κωδικός παρουσιολογίου',
	`ipalilos`	MEDIUMINT UNSIGNED NOT NULL COMMENT 'Αρμόδιος υπάλληλος',

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

	-- Σε περίπτωση που το παρουσιολόγιο δεν αφορά ούτε προσέλευση, ούτε
	-- αποχώρηση το πεδίο "prosapo" τίθεται null.

	`prosapo`	ENUM (
		'ΠΡΟΣΕΛΕΥΣΗ',
		'ΑΠΟΧΩΡΗΣΗ'
	) NULL DEFAULT NULL COMMENT 'Είδος παρουσιολογίου',
	`perigrafi`	VARCHAR(128) NULL DEFAULT NULL COMMENT 'Περιγραφή',
	`katastasi`	ENUM (
		'ΕΚΚΡΕΜΕΣ',
		'ΑΝΥΠΟΓΡΑΦΟ',
		'ΚΥΡΩΜΕΝΟ',
		'ΕΠΙΚΥΡΩΜΕΝΟ'
	) NOT NULL DEFAULT 'ΕΚΚΡΕΜΕΣ' COMMENT 'Κατάσταση παρουσιολογίου',
	`alagi`		DATETIME NOT NULL COMMENT 'Ημερομηνία και ώρα αλλαγής κατάστασης',

	PRIMARY KEY (
		`kodikos`
	) USING HASH,

	UNIQUE INDEX (
		`protipo`
	) USING HASH,

	INDEX (
		`imerominia`,
		`ipiresia`
	) USING BTREE
)

COMMENT = 'Πίνακας παρουσιολογίων'
;

CREATE TABLE `ipografi` (
	`deltio`	MEDIUMINT UNSIGNED NOT NULL COMMENT 'Παρουσιολόγιο',
	`taxinomisi`	TINYINT UNSIGNED NOT NULL COMMENT 'Τάξη υπογραφής',
	`titlos`	VARCHAR(128) NULL DEFAULT NULL COMMENT 'Τίτλος αρμοδίου',
	`armodios`	MEDIUMINT UNSIGNED NOT NULL COMMENT 'Αρμόδιος υπάλληλος',

	-- Το πεδίο "checok" συμπληρώνεται από τον υπογράφοντα και υποδηλώνει
	-- τη χρονική στιγμή κατά την οποία ο υπογράφων επικυρώνει τα στοιχεία
	-- του παρουσιολογίου. Ουσιαστικά πρόκειται για το υποκατάστατο της
	-- της φυσικής υπογραφής του παρουσιολογίου.

	`checkok`	DATETIME NULL DEFAULT NULL COMMENT 'Ημερομηνία και ώρα ελέγχου',

	INDEX (
		`deltio`,
		`taxinomisi`
	) USING BTREE
)

COMMENT = 'Πίνακας υπογραφών παρουσιολογίου'
;

CREATE TABLE `parousia` (
	`deltio`	MEDIUMINT UNSIGNED NOT NULL COMMENT 'Παρουσιολόγιο',
	`ipalilos`	MEDIUMINT UNSIGNED NOT NULL COMMENT 'Υπάλληλος',
	`orario`	VARCHAR(64) NULL DEFAULT NULL COMMENT 'Ωράριο υπαλλήλου',
	`karta`		MEDIUMINT UNSIGNED NULL DEFAULT NULL COMMENT 'Αριθμός κάρτας',
	`meraora`	DATETIME NULL DEFAULT NULL COMMENT 'Ημερομηνία και ώρα προσέλευσης/αποχώρησης',

	-- Ακολουθούν τα στοιχεία άδειας που ίσως έχει ο εργαζόμενος στο
	-- συγκεκριμένο διάστημα.

	`adidos`	ENUM (
		'ΚΑΝΟΝΙΚΗ',
		'ΚΑΝΟΝΙΚΗ (ΜΕΤΑΦΟΡΑ)',
		'ΑΝΑΡΡΩΤΙΚΗ Υ/Δ',
		'ΑΝΑΡΡΩΤΙΚΗ',
		'ΑΣΘΕΝΕΙΑ TEKNOY',
		'ΓΟΝΙΚΗ ΣΧΟΛ. ΕΠΙΔ.',
		'ΓΟΝΙΚΗ ΑΝΑΤΡΟΦΗΣ',
		'ΚΥΗΣΕΩΣ & ΛΟΧΕΙΑΣ',
		'ΡΕΠΟ ΑΙΜΟΔΟΣΙΑΣ',
		'ΡΕΠΟ ΥΠΕΡΩΡΙΑΣ',
		'ΡΕΠΟ ΑΝΑΠΑΥΣΗΣ',
		'ΣΕΜΙΝΑΡΙΟ',
		'ΣΠΟΥΔΑΣΤΙΚΗ',
		'ΣΥΝΔΙΚΑΛΙΣΤΙΚΗ',
		'ΓΑΜΟΥ',
		'ΠΕΝΘΟΥΣ',
		'ΕΚΛΟΓΙΚΗ',
		'ΑΘΛΗΤΙΚΗ',
		'ΔΙΚΑΣΤΗΡΙΟ',
		'ΣΤΡΑΤΙΩΤΙΚΗ',
		'ΕΙΔΙΚΗ ΑΔΕΙΑ',
		'ΑΠΕΡΓΙΑ',
		'ΑΝΕΥ ΑΠΟΔΟΧΩΝ',
		'ΔΙΑΘΕΣΙΜΟΤΗΤΑ',
		'ΑΡΓΙΑ',
		'ΛΥΣΗ ΣΧ. ΕΡΓΑΣΙΑΣ',
		'ΜΕΤΑΚΙΝΗΣΗ'
	) NULL DEFAULT NULL COMMENT 'Είδος αδείας',
	`adapo`		DATE NULL DEFAULT NULL COMMENT 'Ημερομηνία έναρξης αδείας',
	`adeos`		DATE NULL DEFAULT NULL COMMENT 'Ημερομηνία λήξης αδείας',

	-- Ακολουθεί λόγος εξαίρεσης μη καταγεγραμμένης ημερομηνίας και ώρας.

	`excuse`	ENUM (
		'ΕΚΤΟΣ ΕΔΡΑΣ',
		'ΑΙΜΟΔΟΣΙΑ',
		'ΕΟΡΤΗ',
		'ΑΣΘΕΝΕΙΑ',
		'ΠΕΝΘΟΣ',
		'ΕΚΤΑΚΤΩΣ'
	) NULL DEFAULT NULL COMMENT 'Αιτιολόγηση απουσίας',

	-- Ακολουθεί κείμενο με παρατηρήσεις που αφορούν σε επεξεγήσεις
	-- σχετικές με την ώρα προσέλευσης/αποχώρησης.

	`info`		VARCHAR(1024) NULL DEFAULT NULL COMMENT 'Σχόλια',

	PRIMARY KEY (
		`deltio`,
		`ipalilos`
	) USING BTREE
)

COMMENT = 'Πίνακας εγγραφών παρουσιολογίου'
;

COMMIT WORK
;

-------------------------------------------------------------------------------@

\! [ -w /dev/tty ] && echo "Creating relations…" >/dev/tty

ALTER TABLE `ipografi` ADD FOREIGN KEY (
	`deltio`
) REFERENCES `deltio` (
	`kodikos`
) ON UPDATE CASCADE ON DELETE CASCADE
;

ALTER TABLE `parousia` ADD FOREIGN KEY (
	`deltio`
) REFERENCES `deltio` (
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
