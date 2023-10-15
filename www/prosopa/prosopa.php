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
// Updated: 2023-10-13
// Updated: 2022-09-29
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

$prosvasi = letrak::prosvasi_check();
$kodikos = pandora::parameter_get("deltio");

if (letrak::deltio_invalid_kodikos($kodikos))
letrak::fatal_error_json("Μη αποδεκτός κωδικός παρουσιολογίου");

$ipalilos_table = letrak::erpota12("ipalilos");

print '{';

///////////////////////////////////////////////////////////////////////////////@

$deltio = (new Deltio())->from_database($kodikos);

if ($deltio->oxi_kodikos())
letrak::fatal_error_json($kodikos . ": δεν βρέθηκε το παρουσιολόγιο");

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
$query .= " AND (`parousia`.`ipalilos` = " . $ipalilos . ")";

$query .= " ORDER BY `l`, `f`, `r`, `i`";

/* debug
print '"query":' . pandora::json_string($query) . ',';
*/

print '"prosopa":[';
$enotiko = "";
$result = pandora::query($query);

while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
	print $enotiko . pandora::json_string(pandora::null_purge($row));
	$enotiko = ",";
}

print '],';

///////////////////////////////////////////////////////////////////////////////@

$query = "SELECT `ipalilos`, `orario`" .
" FROM `letrak`.`orario`" .
" WHERE `ipalilos` IN (".
" SELECT `ipalilos`" .
" FROM `letrak`.`parousia`" .
" WHERE `deltio` = " . $kodikos . ")" .
" ORDER BY `ipalilos`, `orario`";
$ipalilos = NULL;
$result = pandora::query($query);

while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
	if ($row["ipalilos"] !== $ipalilos) {
		if (is_null($ipalilos)) {
			/* debug
			print '"queryOrario":' . pandora::json_string($query) . ',';
			*/
			print '"oraria":{';
		}

		else
		print "],";

		$ipalilos = $row["ipalilos"];

		print '"' . $ipalilos . '":[';
		$enotiko = "";
	}

	print $enotiko . '"' . $row["orario"] . '"';
	$enotiko = ",";
}

if (!is_null($ipalilos)) {
	print "]";
	print '},';
}

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

/* debug
print '"queryIpografi":' . pandora::json_string($query) . ',';
*/

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
