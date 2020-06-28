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
// των υπαλλήλων που σχετίζονται με το εν λόγω παρουσιολόγιο.
// @DESCRIPTION END
//
// @HISTORY BEGIN
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

$prosvasi = letrak::prosvasi_get();

if ($prosvasi->oxi_ipalilos())
letrak::fatal_error_json("Διαπιστώθηκε ανώνυμη χρήση");

$kodikos = pandora::parameter_get("deltio");

if (letrak::deltio_invalid_kodikos($kodikos))
letrak::fatal_error_json("Μη αποδεκτός κωδικός δελτίου");

$deltio = (new Deltio())->from_database($kodikos);

if ($deltio->oxi_kodikos())
letrak::fatal_error_json($kodikos . ": δεν βρέθηκε το δελτίο");

switch ($deltio->prosapo_get()) {
case LETRAK_DELTIO_PROSAPO_PROSELEFSI:
	$proselefsi = $deltio;
	$apoxorisi = apoxorisi_get($deltio);
	break;
case LETRAK_DELTIO_PROSAPO_APOXORISI:
	$proselefsi = proselefsi_get($deltio);
	$apoxorisi = $deltio;
	break;
default:
	letrak::fatal_error_json("Μη αποδεκτό είδος δελτίου");
}

$parousia = array();

parousia_get($apoxorisi, "a");
parousia_get($proselefsi, "p");

print '{';
///////////////////////////////////////////////////////////////////////////////@
	print '"proselefsi":' . $proselefsi->kodikos_get() . ',';
	print '"apoxorisi":' . $apoxorisi->kodikos_get() . ',';
	print '"parousia":' . pandora::json_string($parousia) . ',';
	print '"error":""';
///////////////////////////////////////////////////////////////////////////////@
print '}';
exit(0);

function apoxorisi_get($deltio) {
	$query = "SELECT `kodikos`" .
		" FROM `letrak`.`deltio`" .
		" WHERE `protipo` = " . $deltio->kodikos_get();

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
	$query = "SELECT `protipo`" .
		" FROM `letrak`.`deltio`" .
		" WHERE `kodikos` = " . $deltio->kodikos_get();

	$row = pandora::first_row($query, MYSQLI_NUM);

	if ((!$row) || (!$row[0]))
	letrak::fatal_error_json("Ακαθόριστο σχετικό δελτίο προσέλευσης");

	$x = (new Deltio())->from_database($row[0]);

	if ($x->oxi_kodikos() ||
		($x->prosapo_get() != LETRAK_DELTIO_PROSAPO_PROSELEFSI))
	letrak::fatal_error_json("Δεν εντοπίστηκε σχετικό δελτίο προσέλευσης");

	return $x;
}

function parousia_get($deltio, $prosapo) {
	global $parousia;

	$query = "SELECT * FROM `letrak`.`parousia`" .
		" WHERE `deltio` = " . $deltio->kodikos_get();
	$result = pandora::query($query);

	while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
		$p =  new Parousia($row);
		$ipalilos = $p->ipalilos_get();

		if (!array_key_exists($ipalilos, $parousia))
		$parousia[$ipalilos] = array();

		$x = $parousia[$ipalilos];

		$x["o"] = $p->orario_get();
		$x["k"] = $p->karta_get();
		$x[$prosapo] = $p->meraora_get();
		$x["ai"] = $p->adidos_get();
		$x["aa"] = $p->adapo_get();
		$x["ae"] = $p->adeos_get();
		$x[$prosapo . "x"] = $p->excuse_get();

		$parousia[$ipalilos] = $x;
	}
}

print '"deltio":' . $deltio->json_economy() . ",";

$query = "SELECT " . LETRAK_PROSOPA_PROJECTION_COLUMNS .
" FROM `letrak`.`parousia` AS `parousia`" .
" LEFT JOIN " . $ipalilos_table . " AS `ipalilos` " .
" ON `ipalilos`.`kodikos` = `parousia`.`ipalilos`" .
" WHERE (`parousia`.`deltio` = " . $kodikos . ")";

$ipalilos = $prosvasi->ipalilos_get();
$ipiresia = $deltio->ipiresia_get();

if ($deltio->oxi_ipografon($ipalilos) &&
	$prosvasi->oxi_prosvasi_ipiresia($ipiresia))
$query .= " AND (`parousia`.`ipalilos` = " . $prosvasi->ipalilos_get() . ")";

$query .= " ORDER BY `l`, `f`, `r`, `i`";

print '"query":' . pandora::json_string($query) . ',';

print '"prosopa":[';
$enotiko = "";
$result = pandora::query($query);

while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
	print $enotiko . pandora::json_string(pandora::null_purge($row));
	$enotiko = ",";
}

print '],';

///////////////////////////////////////////////////////////////////////////////@

$query = "SELECT " .
"`ipografi`.`taxinomisi` AS `x`, " .
"`ipografi`.`titlos` AS `t`, " .
"`ipografi`.`armodios` AS `a`, " .
"`ipalilos`.`eponimo` AS `e`, " .
"`ipalilos`.`onoma` AS `o`, " .
"`ipografi`.`checkok` AS `c`" .
" FROM `letrak`.`ipografi` AS `ipografi` " .
" LEFT JOIN " . $ipalilos_table . " AS `ipalilos` " .
" ON `ipalilos`.`kodikos` = `ipografi`.`armodios`" .
" WHERE (`ipografi`.`deltio` = " . $kodikos . ")" .
" ORDER BY `x`";

print '"queryIpografi":' . pandora::json_string($query) . ',';

print '"ipografes":[';
$enotiko = "";
$result = pandora::query($query);

while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
	// Απαλοιφή των πεδίων με null τιμές
	foreach ($row as $k => $v) {
		if (!isset($v))
		unset($row[$k]);
	}

	print $enotiko . pandora::json_string($row);
	$enotiko = ",";
}

print '],';

///////////////////////////////////////////////////////////////////////////////@
print '"error":""}';
exit(0);
?>
