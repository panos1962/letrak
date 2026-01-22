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
// www/lib/kodikosAlagi.php —— Αλλαγή κωδικού χρήστη
// @FILE END
//
// @DESCRIPTION BEGIN
// Το παρόν καλείται με κλικ στα στοιχεία του χρήστη που εμφανίζονται επάνω
// δεξιά στη σελίδα. Εντοπίζεται ο χρήστης και τα στοιχεία πρόσβασης και
// επιστρέφεται το public key του χρήστη προκειμένου να χρησιμοποιηθεί στη
// σελίδα αλλαγής κωδικού (password).
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Created: 2026-01-22
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

$prosvasi = letrak::prosvasi_check();
$ipalilos = $prosvasi->ipalilos_get();

$query = "SELECT `ipemail`, `premail`" .
	" FROM " . letrak::erpota12("ipalilos") .
	" WHERE `kodikos` = " . $ipalilos;
pandora::query($query);

$row = pandora::first_row($query, MYSQLI_NUM);

if ($row[0])
$email = $row[0];

elseif ($row[1])
$email = $row[1];

else
lathos("Ακαθόριστο email χρήστη");

$query = "SELECT `pubkey`" .
	" FROM `erpota`.`prosvasi`" .
	" WHERE `ipalilos` = " . $ipalilos;
pandora::query($query);

$row = pandora::first_row($query, MYSQLI_NUM);

if (!$row)
lathos("Αδυναμία εντοπισμού χρήστη");

print "{" .
	'"m":' . pandora::json_string($email) . "," .
	'"k":' . pandora::json_string($row[0]) . "}";
exit(0);

function lathos($msg) {
	print '{"e":' . pandora::json_string($msg) . "}";
	exit(0);
}
?>
