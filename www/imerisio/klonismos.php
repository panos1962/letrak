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
// www/imerisio/klonismos.php —— Δημιουργία αντιγράφου παρουσιολογίου
// @FILE END
//
// @DESCRIPTION BEGIN
// Το παρόν πρόγραμμα καλείται από τη σελίδα των παρουσιολογίων και δέχεται
// ως παράμετρο έναν κωδικό παρουσιολογίου. Σκοπός του προγράμματος είναι
// να δημιουργήσει ένα κλώνο του συγκεκριμένου παρουσιολογίου (φυσικά με
// νέο κωδικό) και να το επιστρέψει στη σελίδα των παρουσιολογίων.
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2020-04-30
// Created: 2020-04-22
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

$protipo = pandora::parameter_get("kodikos");

if (pandora::not_integer($protipo, 1, LETRAK_IMERISIO_KODIKOS_MAX))
lathos("Ακαθόριστος κωδικός προτύπου");

$query = "SELECT * FROM `letrak`.`imerisio`" .
	" WHERE `kodikos` = " . $protipo;
$protipo = pandora::first_row($query, MYSQLI_ASSOC);

if (!$protipo)
lathos("Αδυναμία εντοπισμού προτύπου");

if ($prosvasi->oxi_update($protipo["ipiresia"]))
lathos("Δεν έχετε δικαίωμα δημιουργίας παρουσιολογίου");

///////////////////////////////////////////////////////////////////////////////@

pandora::autocommit(FALSE);

$query = "INSERT INTO `letrak`.`imerisio` " .
"(`protipo`, `ipalilos`, `imerominia`," .
" `ipiresia`, `prosapo`, `perigrafi`) VALUES (" .
$protipo["kodikos"] . ", " .
$prosvasi->ipalilos_get() . ", NOW(), " .
pandora::sql_string($protipo["ipiresia"]) . ", " .
pandora::sql_string($protipo["prosapo"]) . ", " .
pandora::sql_string($protipo["perigrafi"]) . ")";
pandora::query($query);

if (pandora::affected_rows() !== 1) {
	pandora::rollback();
	lathos("Αποτυχία δημιουργίας αντιγράφου");
}

$kodikos = pandora::insert_id();

$query = "INSERT INTO `letrak`.`parousia` " .
"(`imerisio`, `ipalilos`, `karta`, `orario`) " .
"SELECT " . $kodikos . ", `ipalilos`, `karta`, `orario` " .
"FROM `letrak`.`parousia` WHERE `imerisio` = " . $protipo["kodikos"];
pandora::query($query);

pandora::query("SET @tax := 0");

$query = "INSERT INTO `letrak`.`ipografi`" .
	" (`imerisio`, `taxinomisi`, `titlos`, `armodios`)" .
	" SELECT " . $kodikos . ", (@tax := @tax + 1), `titlos`, `armodios`" .
	" FROM `letrak`.`ipografi` WHERE `imerisio` = " . $protipo["kodikos"] .
	" ORDER BY `taxinomisi`";
pandora::query($query);

pandora::commit();

$query = "SELECT " . LETRAK_IMERISIO_PROJECTION_COLUMNS .
	" FROM `letrak`.`imerisio`" .
	" WHERE `kodikos` = " . $kodikos;
$row = pandora::first_row($query, MYSQLI_ASSOC);

if (!$row)
lathos("Αποτυχία εντοπισμού αντιγράφου");

print '{"imerisio":' . pandora::json_string($row) . '}';
exit(0);

///////////////////////////////////////////////////////////////////////////////@

function lathos($msg) {
	print '{"error":' . pandora::json_string($msg) . '}';
	exit(0);
}
?>
