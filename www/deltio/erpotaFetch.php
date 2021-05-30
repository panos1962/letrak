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
// Updated: 2020-05-30
// Updated: 2020-05-18
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
letrak::fatal_error_json("Διαπιστώθηκε ανώνυμη χρήση");

if (cached_data())
exit(0);

print '{';

///////////////////////////////////////////////////////////////////////////////@

$query = "SELECT" .
	" `kodikos` AS `k`," .
	" `perigrafi` AS `p`" .
	" FROM " . letrak::erpota12("ipiresia") .
	" ORDER BY `k`";
$result = pandora::query($query);

print '"ipiresia":[';

$enotiko = "";
while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
	print $enotiko . pandora::json_string($row);
	$enotiko = ",";
}

print '],';

///////////////////////////////////////////////////////////////////////////////@

$query = "SELECT" .
	" `kodikos` AS `k`," .
	" `eponimo` AS `e`," .
	" `onoma` AS `o`," .
	" `patronimo` AS `p`," .
	" DATE_FORMAT(`genisi`, '%d-%m-%Y') AS `g`," .
	" `afm` AS `a`" .
	" FROM " . letrak::erpota12("ipalilos") .
	" ORDER BY `e`, `o`, `p`, `k`";
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

function cached_data() {
	$erpota12 = letrak::erpota12();
	$file = LETRAK_BASEDIR . "/local/erpota/erpota" . $erpota12 . ".json";

	if (!file_exists($file))
	return FALSE;

	if (!($fp = fopen($file, "r")))
	return FALSE;

	while (!feof($fp)) {
		$s = fread($fp, 8192);

		if ($s === FALSE)
		exit(2);

		print $s;
	}

	fclose($fp);
	return TRUE;
}
?>
