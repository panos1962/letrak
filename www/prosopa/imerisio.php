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
// www/prosopa/imerisio.php —— Επιλογή και αποστολή στοιχείων ημερήσιου
// δελτίου προσέλευσης/αποχώρησης υπαλλήλων.
// @FILE END
//
// @DESCRIPTION BEGIN
// Το παρόν πρόγραμμα καλείται από τη σελίδα επεξεργασίας παρουσιολογίου και
// δέχεται ως παράμετρο έναν κωδικό παρουσιολογίου. Σκοπός του προγράμματος
// είναι να επιστρέψει σε json format τα στοιχεία προσέλευσης και αποχώρησης
// των υπαλλήλων που σχετίζονται με το εν λόγω παρουσιολόγιο καθώς επίσης και
// με το συμπληρωματικό του.
//
// Το πρόγραμα δέχεται ως παράμετρο έναν κωδικό δελτίου της ζητούμενης
// ημερομηνίας και με βάση το συγκεκριμένο δελτίο εντοπίζει το συμπληρωματικό
// του. Αυτό σημαίνει ότι αν περάσουμε το δελτίο προσέλευσης θα εντοπιστεί το
// αντίστοιχο δελτίο αποχώρησης και αντίστροφα.
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2022-10-04
// Updated: 2022-03-31
// Updated: 2020-08-25
// Updated: 2020-08-08
// Updated: 2020-06-29
// Updated: 2020-06-28
// Created: 2020-06-27
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

$prosvasi = letrak::prosvasi_check();
$kodikos = pandora::parameter_get("deltio");

if (letrak::deltio_invalid_kodikos($kodikos))
letrak::fatal_error_json("Μη αποδεκτός κωδικός δελτίου");

$deltio = (new Deltio())->from_database($kodikos);

if ($deltio->oxi_kodikos())
letrak::fatal_error_json($kodikos . ": δεν βρέθηκε το δελτίο");

// Αρχικά μπορούσαμε να εκτυπώσουμε ημερήσιο δελτίο είτε από το δελτίο
// προσέλευσης, είτε από το δελτίο αποχώρησης. Επειδή όμως για την
// εκτύπωση του ημερήσιου δελτίου είναι απαραίτητο να υπάρχουν και τα
// δύο δελτία, περιορίζουμε τη δυνατότητα εκτύπωσης ημερήσιου δελτίου
// μόνο στο δελτίο αποχώρησης. Ο συγκεκριμένος περιορισμός κρίθηκε
// αναγκαίος για λόγους που αφορούν στην κύρωση (υπογραφή) των δελτίων.
// Πράγματι, είναι πιο λογικό η εκτύπωση του ημερήσιου δελτίου να φέρει
// τα στοιχεία κύρωσης του δελτίου αποχώρησης και όχι του δελτίου
// προσέλευσης.

switch ($deltio->prosapo_get()) {
/*
case LETRAK_DELTIO_PROSAPO_PROSELEFSI:
	$proselefsi = $deltio;
	$apoxorisi = apoxorisi_get($deltio);
	break;
*/
case LETRAK_DELTIO_PROSAPO_APOXORISI:
	$proselefsi = proselefsi_get($deltio);
	$apoxorisi = $deltio;
	break;
default:
	letrak::fatal_error_json("Μη αποδεκτό είδος δελτίου");
}

if (!is_prosvasi())
letrak::fatal_error_json("Δεν έχετε πρόσβαση εκτύπωσης ημερήσιου δελτίου");

$parousia = array();

parousia_get($apoxorisi, "a");
parousia_get($proselefsi, "p");
parousia_fix();

print '{';
print '"proselefsi":' . $proselefsi->kodikos_get() . ',';
print '"apoxorisi":' . $apoxorisi->kodikos_get() . ',';
print '"parousia":' . pandora::json_string($parousia);
print '}';
exit(0);

function apoxorisi_get($deltio) {
	$imerominia = $deltio->imerominia->format('Y-m-d');
	$query = "SELECT `kodikos` FROM `letrak`.`deltio`" .
		" WHERE (`imerominia` = '" . $imerominia . "')" .
		" AND (`protipo` = " . $deltio->kodikos_get() . ")" .
		" LIMIT 1";

	$row = pandora::first_row($query, MYSQLI_NUM);

	if ((!$row) || (!$row[0]))
	letrak::fatal_error_json("Ακαθόριστο σχετικό δελτίο αποχώρησης");

	$x = (new Deltio())->from_database($row[0]);

	if ($x->oxi_kodikos() ||
		($x->prosapo_get() != LETRAK_DELTIO_PROSAPO_APOXORISI))
	letrak::fatal_error_json("Δεν εντοπίστηκε σχετικό δελτίο αποχώρησης");

	return $x;
}

function proselefsi_get($deltio) {
	$imerominia = $deltio->imerominia->format('Y-m-d');
	$query = "SELECT `protipo` FROM `letrak`.`deltio`" .
		" WHERE (`imerominia` = '" . $imerominia . "')" .
		" AND (`kodikos` = " . $deltio->kodikos_get() . ")" .
		" LIMIT 1";

	$row = pandora::first_row($query, MYSQLI_NUM);

	if ((!$row) || (!$row[0]))
	letrak::fatal_error_json("Ακαθόριστο σχετικό δελτίο προσέλευσης");

	$x = (new Deltio())->from_database($row[0]);

	if ($x->oxi_kodikos() ||
		($x->prosapo_get() != LETRAK_DELTIO_PROSAPO_PROSELEFSI))
	letrak::fatal_error_json("Δεν εντοπίστηκε σχετικό δελτίο προσέλευσης");

	return $x;
}

function is_prosvasi() {
	global $prosvasi;
	global $proselefsi;
	global $apoxorisi;

	$ipalilos = $prosvasi->ipalilos;
	$ok = TRUE;

	if ($proselefsi->oxi_ipografon($ipalilos))
	$ok = FALSE;

	if ($apoxorisi->oxi_ipografon($ipalilos))
	$ok = FALSE;

	if ($ok)
	return TRUE;

	$ok = TRUE;

	if ($proselefsi->oxi_simetexon($ipalilos))
	$ok = FALSE;

	if ($apoxorisi->oxi_simetexon($ipalilos))
	$ok = FALSE;

	if ($ok)
	return TRUE;

	if ($prosvasi->oxi_prosvasi_ipiresia($proselefsi->ipiresia_get()))
	return FALSE;

	if ($prosvasi->oxi_prosvasi_ipiresia($apoxorisi->ipiresia_get()))
	return FALSE;

	return TRUE;
}

function parousia_get($deltio, $prosapo) {
	global $parousia;

	$query = "SELECT `ipalilos`, `orario`, `karta`," .
		" `meraora`, `excuse`, `adidos`," .
		" DATE_FORMAT(`adapo`, '%d-%m-%Y') AS `adapo`," .
		" DATE_FORMAT(`adeos`, '%d-%m-%Y') AS `adeos`," .
		" `info`" .
		" FROM `letrak`.`parousia`" .
		" WHERE `deltio` = " . $deltio->kodikos_get();
	$result = pandora::query($query);

	while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
		$p =  new Parousia($row);
		$ipalilos = $p->ipalilos_get();

		if (!array_key_exists($ipalilos, $parousia)) {
			$parousia[$ipalilos] = array();

			$parousia[$ipalilos]["o"] = $p->orario_get();
			$parousia[$ipalilos]["k"] = $p->karta_get();
			$parousia[$ipalilos]["ai"] = $p->adidos_get();
			$parousia[$ipalilos]["aa"] = $p->adapo_get();
			$parousia[$ipalilos]["ae"] = $p->adeos_get();
		}

		$parousia[$ipalilos][$prosapo] = $p->meraora_get();
		$parousia[$ipalilos] = $parousia[$ipalilos];
		$parousia[$ipalilos][$prosapo . "x"] = $p->excuse_get();
		$parousia[$ipalilos][$prosapo . "f"] = $p->info_get();
	}
}

function parousia_fix() {
	global $parousia;

	foreach ($parousia as $ipalilos => $data) {
		foreach ($data as $k => $v) {
			if (!isset($v))
			unset($data[$k]);
		}

		// Αν υπάρχει άδεια για τον ανά χείρας υπάλληλο, μηδενίζουμε
		// τυχόν ώρες και αιτιολογίες προσέλευσης και αποχώρησης.

		if (array_key_exists("ai", $data) && $data["ai"]) {
			unset($data["p"]);
			unset($data["a"]);
			unset($data["px"]);
			unset($data["ax"]);
			$parousia[$ipalilos] = $data;
			continue;
		}

		// Δεν υπάρχει άδεια, επομένως μηδενίζουμε τυχόν συμπληρωμένα
		// στοιχεία αδείας.

		unset($data["ai"]);
		unset($data["aa"]);
		unset($data["ae"]);

		// Αν υπάρχει αιτιολογία προσέλευσης, μηδενίζουμε τυχόν
		// ώρα προσέλευσης.

		if (array_key_exists("px", $data) && $data["px"])
		unset($data["p"]);

		// Αν υπάρχει αιτιολογία αποχώρησης, μηδενίζουμε τυχόν
		// ώρα αποχώρησης.

		if (array_key_exists("ax", $data) && $data["ax"])
		unset($data["a"]);

		// Αν δεν υπάρχουν παρατηρήσεις, διαγράφουμε τα αντίστοιχα
		// στοιχεία από το array.

		if (array_key_exists("pf", $data) && (!$data["pf"]))
		unset($data["pf"]);

		if (array_key_exists("af", $data) && (!$data["af"]))
		unset($data["af"]);

		$parousia[$ipalilos] = $data;
	}
}
?>
