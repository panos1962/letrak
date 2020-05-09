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
// www/deltio/erpotaFetch.php —— Επιλογή και αποστολή δεδομένων προσωπικού
// @FILE END
//
// @DESCRIPTION BEGIN
// Το παρόν πρόγραμμα καλείται από τη σελίδα των παρουσιολογίων και επιλέγει
// δεδομένα από την τρέχουσα database προσωπικού τα οποία επιστρέφει σε json
// format στη σελίδα των παρουσιολογίων. Η κλήση του προγράμματος ασύγχρονα
// μέσω ajax, αμέσως μετά το φόρτωμα της σελίδας.
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Created: 2020-04-20
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

if (letrak::oxi_xristis())
lathos("Διαπιστώθηκε ανώνυμη χρήση");

///////////////////////////////////////////////////////////////////////////////@

$query = "SELECT `timi` FROM `kartel`.`parametros` WHERE `kodikos` = " .
	pandora::sql_string("erpota12");
$row = pandora::first_row($query, MYSQLI_ASSOC);

if (!$row)
lathos("Ακαθόριστη έκδοση database προσωπικού");

switch ($row["timi"]) {
case 1:
case 2:
	$erpota12 = "erpota" . $row["timi"];
	break;
default:
	lathos("Μη αποδεκτή έκδοση database προσωπικού");
}

print '{';

///////////////////////////////////////////////////////////////////////////////@

$query = "SELECT `kodikos` AS `k`, `perigrafi` AS `p`" .
	" FROM `letrak`.`adidos` ORDER BY `taxinomisi`, `kodikos`";
$result = pandora::query($query);

print '"adidos":[';

$enotiko = "";
while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
	print $enotiko . pandora::json_string($row);
	$enotiko = ",";
}

print '],';

///////////////////////////////////////////////////////////////////////////////@

$query = "SELECT " .
	"`kodikos` AS `k`, " .
	"`perigrafi` AS `p` " .
	"FROM `" . $erpota12 . "`.`ipiresia` " .
	"ORDER BY `kodikos`";
$result = pandora::query($query);

print '"ipiresia":[';

$enotiko = "";
while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
	print $enotiko . pandora::json_string($row);
	$enotiko = ",";
}

print '],';

///////////////////////////////////////////////////////////////////////////////@

$query = "SELECT " .
	"`kodikos` AS `k`, " .
	"`eponimo` AS `e`, " .
	"`onoma` AS `o`, " .
	"`patronimo` AS `p`, " .
	"DATE_FORMAT(`genisi`, '%d-%m-%Y') AS `g`, " .
	"`afm` AS `a`" .
	"FROM `" . $erpota12 . "`.`ipalilos` " .
	"WHERE `katastasi` = 'ΕΝΕΡΓΟΣ' " .
	"ORDER BY `eponimo`, `onoma`, `patronimo`, `kodikos`";
$result = pandora::query($query);

print '"ipalilos":[';

$enotiko = "";
while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
	if (!$row["g"])
	unset($row["g"]);

	if (!$row["a"])
	unset($row["a"]);

	print $enotiko . pandora::json_string($row);
	$enotiko = ",";
}

print '],';

///////////////////////////////////////////////////////////////////////////////@

print '"error":""}';

exit(0);
?>
