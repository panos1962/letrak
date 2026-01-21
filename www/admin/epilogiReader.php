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
// www/admin/epilogiReader.php —— Επιλογή καρταναγνωστών
// @FILE END
//
// @DESCRIPTION BEGIN
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Created: 2026-01-21
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

if ($prosvasi->ipiresia_oxi_admin(''))
lathos("Διαπιστώθηκε ελλιπής εξουσιοδότηση κατά την επιλογή καρταναγνωστών");

$query = "SELECT `kodikos`, `perigrafi`" .
	" FROM `kartel`.`reader`";
$result = pandora::query($query);

print "{";
$enotiko = "";

while ($row = $result->fetch_row()) {
	print $enotiko .
		pandora::json_string($row[0]) . ":" .
		pandora::json_string($row[1]);
	$enotiko = ",";
}

$result->close();
print "}";

exit(0);

///////////////////////////////////////////////////////////////////////////////@

function lathos($s) {
	print '{"error":' . pandora::json_string($s) . '}';
	exit(0);
}
