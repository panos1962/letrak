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
// www/prosopa/ipogarfiInsert.php —— Ενημέρωση υπογραφής παρουσιολογίου
// @FILE END
//
// @DESCRIPTION BEGIN
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Created: 2020-04-29
// @HISTORY END
//
// @END
//
///////////////////////////////////////////////////////////////////////////////@

require_once("../../local/conf.php");
require_once(LETRAK_BASEDIR . "/www/lib/letrak.php");

pandora::
header_data()::
session_init()::
database();

$prosvasi = letrak::prosvasi_get();

if ($prosvasi->oxi_ipalilos())
lathos("Διαπιστώθηκε ανώνυμη χρήση");

$imerisio = pandora::parameter_get("imerisio");

if (pandora::not_integer($imerisio, 1))
lathos("Μη αποδεκτός κωδικός παρουσιολογίου");

$isimonixat = pandora::parameter_get("isimonixat");

if (pandora::not_integer($isimonixat, 1, 250))
lathos($isimonixat . "Μη αποδεκτός υφιστάμενος ταξινομικός αριθμός");

$armodios = pandora::parameter_get("armodios");

if (pandora::not_integer($armodios, 1))
lathos("Μη αποδεκτός αρμόδιος");

$taxinomisi = pandora::parameter_get("taxinomisi");

if (!isset($taxinomisi))
$taxinomisi = 255;

elseif (pandora::not_integer($taxinomisi, 1, 255))
lathos("Μη αποδεκτός νέος ταξινομικός αριθμός");

$titlos = pandora::parameter_get("titlos");
$ipalilos_table = letrak::erpota12("ipalilos");

///////////////////////////////////////////////////////////////////////////////@

pandora::autocommit(FALSE);

$query = "SELECT COUNT(*) FROM `letrak`.`ipografi` WHERE `imerisio` = " .
	$imerisio;
$row = pandora::first_row($query, MYSQLI_NUM);

$taxmax = (int)$row[0];

$query = "DELETE FROM `letrak`.`ipografi` WHERE (`imerisio` = " .
	$imerisio . ") AND (`taxinomisi` = " . $isimonixat . ")";
pandora::query($query);

if (pandora::affected_rows() != 1) {
	pandora::rollback();
	lathos("Απέτυχε η ενημέρωση της υπογραφής");
}

if ($taxinomisi > $isimonixat) {
	$query = "UPDATE `letrak`.`ipografi`" .
		" SET `taxinomisi` = `taxinomisi` - 1" .
		" WHERE (`imerisio` = " . $imerisio . ")" .
		" AND (`taxinomisi` > " . $isimonixat . ")" .
		" AND (`taxinomisi` <= " . $taxinomisi . ")";
	pandora::query($query);
}

elseif ($taxinomisi < $isimonixat) {
	$query = "UPDATE `letrak`.`ipografi`" .
		" SET `taxinomisi` = `taxinomisi` + 1" .
		" WHERE (`imerisio` = " . $imerisio . ")" .
		" AND (`taxinomisi` < " . $isimonixat . ")" .
		" AND (`taxinomisi` >= " . $taxinomisi . ")";
	pandora::query($query);
}

$query = "INSERT INTO `letrak`.`ipografi` " .
	" (`imerisio`, `taxinomisi`, `armodios`, `titlos`)" .
	" VALUES (" . $imerisio . ", " . $taxinomisi . ", " .
	$armodios . ", " . pandora::sql_string($titlos) . ")";
pandora::query($query);

if (pandora::affected_rows() !== 1)
lathos("Απέτυχε η προσθήκη υπογραφής");

pandora::query("SET @taxinomisi := 0");

$query = "UPDATE `letrak`.`ipografi` SET `taxinomisi` =" .
	" (SELECT @taxinomisi := @taxinomisi + 1)" .
	" WHERE `imerisio` = " . $imerisio .
	" ORDER BY `taxinomisi`";
pandora::query($query);

pandora::commit();

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
" WHERE (`ipografi`.`imerisio` = " . $imerisio . ")";
" ORDER BY `x`";

print '{"queryIpografi":' . pandora::json_string($query) . ',';

print '"ipografes":[';
$enotiko = "";
$result = pandora::query($query);

while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
	foreach ($row as $k => $v) {
		if (!isset($v))
		unset($row[$k]);
	}

	print $enotiko . pandora::json_string($row);
	$enotiko = ",";
}

print ']}';

///////////////////////////////////////////////////////////////////////////////@

function lathos($s) {
	print '{"error":' . pandora::json_string($s) . "}";
	exit(0);
}
?>
