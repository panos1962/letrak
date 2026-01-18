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
// Created: 2026-01-18
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

switch ($prosvasi->epipedo_get()) {
case 'VIEW':
case 'UPDATE':
case 'ADMIN':
	break;
default:
	lathos("Διαπιστώθηκε ελλιπής εξουσιοδότηση");
}

$imask = pandora::parameter_get("imask");

lathos("Δεν καθορίστηκαν επαρκή κριτήρια");

///////////////////////////////////////////////////////////////////////////////@

function epilogi($where_clause) {
	$query = "SELECT `kodikos` AS `k`, " .
		"`eponimo` AS `e`, " .
		"`onoma` AS `o`, " .
		"`patronimo` AS `p` " .
		"FROM " . letrak::erpota12("ipalilos") .
		"WHERE " . $where_clause .
		" ORDER BY `e`, `o`, `p`, `k`" .
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

function lathos($s) {
	print '{"error":' . pandora::json_string($s) . '}';
	exit(0);
}
