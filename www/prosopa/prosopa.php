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
// www/prosopa/prosopa.php —— Επιλογή και αποστολή στοιχείων παρουσιολογίου
// @FILE END
//
// @DESCRIPTION BEGIN
// Το παρόν πρόγραμμα καλείται από τη σελίδα επεξεργασίας παρουσιολογίου και
// δέχεται ως παράμετρο έναν κωδικό παρουσιολογίου. Σκοπός του προγράμματος
// είναι να επιστρέψει σε json format το παρουσιολόγιο με όλα τα επιμέρους
// στοιχεία του παρουσιολογίου.
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2020-05-06
// Updated: 2020-05-03
// Updated: 2020-04-26
// Created: 2020-04-25
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

$kodikos = pandora::parameter_get("imerisio");

if (letrak::imerisio_invalid_kodikos($kodikos))
lathos("Μη αποδεκτός κωδικός παρουσιολογίου");

$ipalilos_table = letrak::erpota12("ipalilos");

print '{';

///////////////////////////////////////////////////////////////////////////////@

$imerisio = (new Imerisio())->from_database($kodikos);

if ($imerisio->oxi_kodikos())
lathos($kodikos . ": δεν βρέθηκε το παρουσιολόγιο");

print '"imerisio":' . $imerisio->json_economy() . ",";

$query = "SELECT " . LETRAK_PROSOPA_PROJECTION_COLUMNS .
" FROM `letrak`.`parousia` AS `parousia`" .
" LEFT JOIN " . $ipalilos_table . " AS `ipalilos` " .
" ON `ipalilos`.`kodikos` = `parousia`.`ipalilos`" .
" WHERE (`parousia`.`imerisio` = " . $kodikos . ")";

if ($prosvasi->oxi_prosvasi_ipiresia($imerisio->ipiresia_get()))
$query .= " AND (`parousia`.`ipalilos` = " . $prosvasi->ipalilos_get() . ")";

$query .= " ORDER BY `l`, `f`, `p`, `i`";

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
" WHERE (`ipografi`.`imerisio` = " . $kodikos . ")" .
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

///////////////////////////////////////////////////////////////////////////////@

function lathos($s) {
	print '{"error":' . pandora::json_string($s) . "}";
	exit(0);
}

?>
