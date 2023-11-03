<?php
///////////////////////////////////////////////////////////////////////////////@
//
// @BEGIN
//
// @COPYRIGHT BEGIN
// Copyright (C) 2020 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
// @COPYRIGHT END
//
// @FILETYPE BEGIN
// php
// @FILETYPE END
//
// @FILE BEGIN
// www/prosopa/parousiaIpovoli.php —— Υποβολή στοιχείων παρουσίας
// @FILE END
//
// @DESCRIPTION BEGIN
// Το παρόν πρόγραμμα καλείται κατά το submit της φόρμας επεξεργασίας
// λεπτομερειών παρουσίας. Σκοπός του προγράμματος είναι να ενημερωθεί
// ή να εισαχθεί η σχετική εγγραφή στον πίνακα "parousia" με τα στοιχεία
// που παρέχονται από τη φόρμα.
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2023-10-15
// Updated: 2021-05-27
// Updated: 2020-06-26
// Updated: 2020-06-24
// Updated: 2020-05-19
// Created: 2020-05-16
// @HISTORY END
//
// @END
//
///////////////////////////////////////////////////////////////////////////////@

require_once("../../local/conf.php");
require_once(LETRAK_BASEDIR . "/www/lib/letrak.php");

pandora::
header_json()::
session_init()::
database();

$prosvasi = letrak::prosvasi_get();

if ($prosvasi->oxi_ipalilos())
lathos("Διαπιστώθηκε ανώνυμη χρήση");

$deltio_kodikos = pandora::parameter_get("deltio");

if (letrak::deltio_invalid_kodikos($deltio_kodikos))
lathos("Μη αποδεκτός κωδικός παρουσιολογίου");

$deltio = (new Deltio())->from_database($deltio_kodikos);

if ($deltio->oxi_kodikos())
lathos($deltio_kodikos . ": δεν εντοπίστηκε το παρουσιολόγιο");

if ($deltio->is_klisto())
lathos("Το παρουσιολόγιο έχει επικυρωθεί");

if ($deltio->is_ipogegrameno())
lathos("Το παρουσιολόγιο έχει κυρωθεί");

if ($prosvasi->oxi_deltio_edit($deltio_kodikos))
lathos("Access denied");

$ipalilos_kodikos = pandora::parameter_get("ipalilos");

if (letrak::ipalilos_invalid_kodikos($ipalilos_kodikos))
lathos("Μη αποδεκτός αρ. μητρώου εργαζομένου");

$ipalilos = (new Ipalilos())->from_database($ipalilos_kodikos);

if ($ipalilos->oxi_kodikos())
lathos($ipalilos_kodikos . ": δεν εντοπίστηκε ο εργαζόμενος");

$adidos = adia_get($adapo, $adeos);
$excuse = excuse_get();

if (($adidos !== "NULL")  && ($excuse !== "NULL"))
lathos("Καθορίσατε άδεια ΚΑΙ αιτιολογία");

///////////////////////////////////////////////////////////////////////////////@

$orario = orario_get();

$karta = karta_get($ipalilos_kodikos);

if (letrak::ipalilos_invalid_karta($karta))
$karta = "NULL";

$meraora = meraora_get();
$info = info_get();

// Στο σημείο αυτό επιλέγουμε τα δεδομένα χρονικής καταγραφής προκειμένου να
// διαπιστώσουμε κατ' αρχάς αν υπάρχει ήδη σχετική καταχώρηση στην database
// και δευτερευόντως αν τα δεδομένα χρονικής καταγραφής διαφέρουν από τα
// αποσταλθέντα.

$query = "SELECT" .
	" DATE_FORMAT(`meraora`, '%Y-%m-%d %H:%i') AS `meraora`," .
	" `kataxorisi`" .
	" FROM `letrak`.`parousia`" .
	" WHERE (`deltio` = " . $deltio_kodikos . ") " .
	" AND (`ipalilos` = " . $ipalilos_kodikos . ")";
$result = pandora::query($query);
$row = $result->fetch_assoc();
$result->close();

// Προβαίνουμε τώρα στους σχετικούς ελέγχους προκειμένου να επιλέξουμε αν θα
// προσθέσουμε νέα εγγραφή στην database ή αν θα ενημερώσουμε την υπάρχουσα.
// Επίσης, καθορίζουμε τον τρόπο της καταγραφής που μπορεί να είναι "WINPAK"
// εφόσον η καταγραφή έχει καταχωρηθεί από το σύστημα, "ΣΥΝΤΑΚΤΗΣ" αν έχει
// τροποποιηθεί από τον συντάκτη, ή να παραμείνει κενή αν δεν καθορίστηκαν
// χρονικά δεδομένα.

if ($row) {
	$action = "REPLACE";

	// Αν δεν αλλάζει η ημερομηνία και ώρα προσέλευσης/αποχώρησης, τότε
	// διατηρούμε τον ίδιο τρόπο καταχώρησης.

	if ($row["meraora"] === $meraora)
	$kataxorisi = $row["kataxorisi"];

	// Σε περίπτωση αλλαγής ημερομηνίας και ώρας προσέλευσης/αποχώρησης
	// θέτουμε στο πεδίο της καταχώρησης την τιμή "ΣΥΝΤΑΚΤΗΣ" ακόμη και
	// αν η τιμή του πεδίου τυχαίνει να είναι ίδια με αυτήν που θα μας
	// έδινε το σύστημα μέσω της διαδικασίας αυτόματης συμπλήρωσης. Αν
	// επιθυμούμε να μην φαίνεται ως μεταβολή από τον συντάκτη, τότε θα
	// πέπει να καθαρίσουμε το πεδίο ημερομηνίας και ώρας προσέλευσης/
	// αποχώρησης και να διενεργήσουμε αυτόματη συμπλήρωση.

	else
	$kataxorisi = LETRAK_PAROUSIA_KATAXORISI_SINTAKTIS;
}

else {
	$action = "INSERT";
	$kataxorisi = LETRAK_PAROUSIA_KATAXORISI_SINTAKTIS;
}

// Διαμορφώνουμε κατάλληλα τα στοιχεία χρονικής καταγραφής προκειμένου να
// μπορούν να εμφυτευτούν στο SQL query εισαγωγής ή ενημέρωσης.

if ($meraora)
$meraora = pandora::sql_string($meraora);

else {
	$meraora = "NULL";
	$kataxorisi = "";
}

if ($kataxorisi)
$kataxorisi = pandora::sql_string($kataxorisi);

else
$kataxorisi = "NULL";

$query = $action . " INTO `letrak`.`parousia` " .
	"(`deltio`, `ipalilos`, `orario`, `karta`, `meraora`, `kataxorisi`," .
	" `adidos`, `adapo`, `adeos`, `excuse`, `info`) VALUES (" .
	$deltio_kodikos . ", " .
	$ipalilos_kodikos . ", " .
	$orario . ", " .
	$karta . ", " .
	$meraora . ", " .
	$kataxorisi . ", " .
	$adidos . ", " .
	$adapo . ", " .
	$adeos . ", " .
	$excuse . ", " .
	$info . ")";
pandora::query($query);

if (pandora::affected_rows() < 1)
lathos("Αστοχία υποβολής στοιχείων παρουσίας");

// Στο σημείο αυτό έχουμε τελειώσει ουσιαστικά με την υποβολή των στοιχείων
// και θα μπορούσαμε να επιστρέψουμε. Ωστόσο, επιχειρούμε να καταχωρήσουμε
// το ωράριο που έχει υποβληθεί, ως πιθανή επιλογή ωραρίου για επόμενη
// καταχώρηση.
//
// Αυτή η ανάγκη προέκυψε τον Οκτώβριο του 2023, με την ένταξη των ΚΕΠ στο
// σύστημα των ηλεκτρονικών παρουσιολογίων.

if ($orario) {
	$query = "REPLACE INTO `letrak`.`orario` " .
		"(`ipalilos`, `orario`) VALUES " .
		"(" . $ipalilos_kodikos . ", " . $orario . ")";
	pandora::query($query);
}

exit(0);

function orario_get() {
	$s = pandora::parameter_get("orario");

	if (!isset($s))
	return "NULL";

	if (!$s)
	return "NULL";

	$orario = new Orario($s);

	if ($orario->oxi_orario())
	lathos($s . ": μη αποδεκτό ωράριο");

	return pandora::sql_string($orario->to_string());
}

// Η function "karta_get" επιχειρεί να εντοπίσει τον αριθμό κάρτας του
// υπαλλήλου που εισάγεται ή ενημερώνεται.

function karta_get($ipalilos) {
	// Πρώτα ελέγχουμε αν ο αριθμός κάρτας έχει συμπληρωθεί από τον
	// χρήστη στη φόρμα ενημέρωσης λεπτομερειών συμβάντων.

	$s = pandora::parameter_get("karta");

	if (!isset($s))
	return NULL;

	if (!$s)
	return NULL;

	// Αν δοθεί "@" στον κωδικό κάρτας, τότε επιχειρούμε να εντοπίσουμε
	// την κάρτα του υπαλλήλου από την database.

	if ($s === "@")
	return karta_apo_database($ipalilos);

	if (letrak::ipalilos_invalid_karta($s))
	lathos($s . ": μη αποδεκτός αριθμός κάρτας");

	return $s;
}

// Η function "karta_apo_database" δέχεται ένα κωδικό υπαλλήλου και επιχειρεί
// να εντοπίσει τον τρέχοντα αριθμό κάρτας του συγκεκριμένου υπαλλήλου από
// τον πίνακα μεταβολών.

function karta_apo_database($ipalilos) {
	$query = "SELECT `timi` FROM " . letrak::erpota12("metavoli") .
		" WHERE (`ipalilos` = " . $ipalilos . ")" .
		" AND (`idos` = 'ΚΑΡΤΑ') " .
		" ORDER BY `efarmogi` DESC LIMIT 1";

	$row = pandora::first_row($query, MYSQLI_NUM);

	if (!$row)
	return NULL;

	return $row[0];
}

function meraora_get() {
	global $deltio;

	$s = pandora::parameter_get("meraora");

	if (!isset($s))
	return '';

	if (!$s)
	return '';

	$t = DateTime::createFromFormat("d-m-Y H:i", $s);

	if ($t === FALSE)
	lathos($s . ": λανθασμένη ημερομηνία/ώρα συμβάντος");

	$tdlt = $deltio->imerominia_get();

	if (!isset($tdlt))
	return $t->format("Y-m-d H:i");

	$tdlt = DateTime::createFromFormat("Y-m-d H:i:s",
		$tdlt->format("Y-m-d") . " 00:00:00");

	$diafora = $tdlt->diff($t);

	if ($diafora === FALSE)
	lathos($s . ": ακαθόριστη ημερομηνία παρουσιολογίου");

	$max = ($diafora->invert ? 0 : 1);

	if ($diafora->d > $max)
	lathos($s . ": μη αποδεκτή ημερομηνία/ώρα συμβάντος");

	return $t->format("Y-m-d H:i");
}

function adia_get(&$adapo, &$adeos) {
	global $deltio;

	// Είδος αδείας

	$adidos = pandora::parameter_get("adidos");

	if (!isset($adidos))
	$adidos = NULL;

	elseif (!$adidos)
	$adidos = NULL;

	// Έναρξη αδείας

	$adapo = pandora::parameter_get("adapo");

	if (!isset($adapo))
	$adapo = NULL;

	elseif (!$adapo)
	$adapo = NULL;

	// Λήξη αδείας

	$adeos = pandora::parameter_get("adeos");

	if (!isset($adeos))
	$adeos = NULL;

	elseif (!$adeos)
	$adeos = NULL;

	// Διάφοροι έλεγχοι

	if ((!isset($adidos)) && (isset($adidos) || isset($adeos)))
	lathos("Ακαθόριστο είδος αδείας");

	if (!isset($adidos)) {
		$adapo = "NULL";
		$adeos = "NULL";
		return "NULL";
	}

	if (isset($adapo)) {
		$s = DateTime::createFromFormat("d-m-Y", $adapo);

		if ($s === FALSE)
		lathos($adapo . ": λανθασμένη ημερομηνία έναρξης αδείας");

		$adapo = $s->format("Y-m-d");
		$apo = DateTime::createFromFormat("Y-m-d H:i:s",
			$adapo . " 00:00:00");
		$adapo = pandora::sql_string($adapo);
	}

	else {
		$adapo = "NULL";
		$apo = NULL;
	}

	if (isset($adeos)) {
		$s = DateTime::createFromFormat("d-m-Y", $adeos);

		if ($s === FALSE)
		lathos($adeos . ": λανθασμένη ημερομηνία λήξης αδείας");

		$adeos = $s->format("Y-m-d");
		$eos = DateTime::createFromFormat("Y-m-d H:i:s",
			$adeos . " 00:00:00");
		$adeos = pandora::sql_string($adeos);
	}

	else {
		$adeos = "NULL";
		$eos = NULL;
	}

	$tdlt = $deltio->imerominia_get();

	$tdlt = DateTime::createFromFormat("Y-m-d H:i:s",
		$tdlt->format("Y-m-d") . " 00:00:00");

	if (isset($apo) && isset($eos)) {
		$diafora = $apo->diff($eos);

		if (($diafora === FALSE) || $diafora->invert)
		lathos("Μη αποδεκτό διάστημα αδείας");
	}

	if (isset($apo)) {
		$diafora = $apo->diff($tdlt);

		if (($diafora === FALSE) || $diafora->invert)
		lathos("Μη αποδεκτή ημερομηνία αρχής αδείας");
	}

	if (isset($eos)) {
		$diafora = $tdlt->diff($eos);

		if (($diafora === FALSE) || $diafora->invert)
		lathos("Μη αποδεκτή ημερομηνία λήξης αδείας");
	}

	return pandora::sql_string($adidos);
}

function excuse_get() {
	$excuse = pandora::parameter_get("excuse");

	if (!isset($excuse))
	return "NULL";

	if (!$excuse)
	return "NULL";

	return pandora::sql_string($excuse);
}

function info_get() {
	$info = pandora::parameter_get("info");

	if (!isset($info))
	return "NULL";

	if (!$info)
	return "NULL";

	return pandora::sql_string(trim($info));
}

function lathos($s) {
	print $s;
	exit(0);
}
?>
