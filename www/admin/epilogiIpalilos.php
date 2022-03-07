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

$prosvasi = letrak::prosvasi_get();

if ($prosvasi->oxi_ipalilos())
lathos("Διαπιστώθηκε ανώνυμη χρήση");

if ($prosvasi->ipiresia_oxi_admin(""))
lathos("Διαπιστώθηκε ελλιπής εξουσιοδότηση");

$karta = pandora::parameter_get("Karta");

if (letrak::ipalilos_invalid_karta($karta))
lathos("Μη αποδεκτός αριθμός κάρτας");

if ($karta)
epilogi_me_karta($karta);

$kodikos = pandora::parameter_get("Kodikos");

if (letrak::ipalilos_invalid_kodikos($kodikos))
lathos("Μη αποδεκτός αρ. μητρώου εργαζομένου");

///////////////////////////////////////////////////////////////////////////////@

function epilogi_me_karta($karta) {
	$query = "SELECT `ipalilos`, `eponimo`, `onoma`, `patronimo`," .
		" DATE_FORMAT(`efarmogi`, '%d-%m-%Y') AS `efarmogi`, `timi`" .
		" FROM " . letrak::erpota12("karta") .
		" WHERE (`timi` = " . $karta . ")" .
		" ORDER BY `eponimo`, `onoma`, `patronimo`," .
		" `ipalilos`, `efarmogi`";
	$result = pandora::query($query);

	print "[";
	$enotiko = "";

	while ($row = $result->fetch_assoc()) {
		print $enotiko . pandora::json_string($row);
		$enotiko = ",";
	}

	$result->close();
	print "]";

	exit(0);
}

function lathos($s) {
	print $s;
	exit(0);
}
