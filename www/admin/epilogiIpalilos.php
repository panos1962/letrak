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
// www/admin/epilogiIpalilos.php —— Επιλογή υπαλλήλων
// @FILE END
//
// @DESCRIPTION BEGIN
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2026-01-21
// Updated: 2025-04-15
// Updated: 2020-03-08
// Created: 2020-03-07
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
lathos("Διαπιστώθηκε ελλιπής εξουσιοδότηση κατά τν επιλογή υπαλλήλων");

$x = pandora::parameter_get("Karta");

if ($x)
epilogi_me_karta($x);

$x = pandora::parameter_get("Kodikos");

if ($x)
epilogi_me_kodiko($x);

$where = "";
where_add($where, "Eponimo", "eponimo");
where_add($where, "Onoma", "onoma");
where_add($where, "Patronimo", "patronimo");
where_add($where, "Premail", "premail");
where_add($where, "Ipemail", "ipemail");

if ($where)
epilogi($where);

lathos("Δεν καθορίστηκαν επαρκή κριτήρια");

///////////////////////////////////////////////////////////////////////////////@

function epilogi_me_karta($karta) {
	if (letrak::ipalilos_invalid_karta($karta))
	lathos("Μη αποδεκτός αριθμός κάρτας");

	epilogi("`karta` = '" . $karta . "'");
}

function epilogi_me_kodiko($kodikos) {
	if (letrak::ipalilos_invalid_kodikos($kodikos))
	lathos("Μη αποδεκτός κωδικός υπαλλήλου");

	epilogi("`ipalilos` = " . $kodikos);
}

function epilogi($where_clause) {
	$query = "SELECT `ipalilos`, `eponimo`, `onoma`, `patronimo`," .
		" `premail`, `ipemail`, `efarmogi` AS `d`, " .
		" DATE_FORMAT(`efarmogi`, '%d-%m-%Y') AS `efarmogi`, " .
		" `karta` FROM " . letrak::erpota12("karta") .
		" WHERE " . $where_clause .
		" ORDER BY `eponimo`, `onoma`, `patronimo`," .
		" `ipalilos`, `d` DESC" .
		" LIMIT 100";
	$result = pandora::query($query);

	print '{"ilist":[';
	$enotiko = "";

	while ($row = $result->fetch_assoc()) {
		print $enotiko . pandora::json_string($row);
		$enotiko = ",";
	}

	$result->close();
	print "]}";

	exit(0);
}

function where_add(&$where, $prm, $col) {
	$x = pandora::parameter_get($prm);

	if (!$x)
	return;

	if ($where)
	$where .= " AND ";

	$where .= "(`" . $col . "` LIKE " .
		pandora::sql_string($x . "%") . ")";
}

function lathos($s) {
	print '{"error":' . pandora::json_string($s) . '}';
	exit(0);
}
