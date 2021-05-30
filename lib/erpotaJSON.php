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
// lib/erpotaJSON.php —— Δημιουργία JSON object δεδομένων προσωπικού
// @FILE END
//
// @DESCRIPTION BEGIN
// Το παρόν πρόγραμμα εκτυπώνει τον πίνακα υπηρεσιών ("ipiresia") και τον
// πίνακα υπαλλήλων ("ipalilos") ως arrays ενός ενιαίου JSON object.
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Created: 2021-05-30
// @HISTORY END
//
// @END
//
///////////////////////////////////////////////////////////////////////////////@

$basedir = getenv("LETRAK_BASEDIR");

if (!$basedir)
$basedir = "/var/opt/letrak";

require_once($basedir . "/local/conf.php");

require_once(PANDORA_BASEDIR . "/lib/pandoraCore.php");
class pandora extends pandoraCore {}

require_once(LETRAK_BASEDIR . "/lib/letrakCore.php");
class letrak extends letrakCore {}

pandora::database();

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
?>
