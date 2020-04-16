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
// www/isodos/isodos.php —— Φόρμα εισόδου στην εφαρμογή "letrak"
// @FILE END
//
// @DESCRIPTION BEGIN
// Ο υπαλληλος συμπληρώνει τον αριθμό μητρώου του ως εργαζομένου στον Δήμο
// Θεσσαλονίκης και τον κωδικό του και εισέρχεται στην εφαρμογή. Ο έλεγχος
// γίνεται μέσω των πεδίων "ipalilos" και "password" του πίνακα "prosvasi"
// της database "erpota".
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Created: 2020-04-16
// @HISTORY END
//
// @END
//
///////////////////////////////////////////////////////////////////////////////@

require_once("../../local/conf.php");
require_once(LETRAK_BASEDIR . "/www/lib/letrak.php");

pandora::
session_init()::
header_data()::
database();

$kodikos = pandora::post_get("ipalilos");

if (!isset($kodikos))
lathos("Ακαθόριστος κωδικός υπαλλήλου");

$password = pandora::post_get("kodikos");

if (!isset($password))
lathos("Ακαθόριστος μυστικός κωδικός");

$query = "SELECT `ipalilos`, `ipiresia`, `level` " .
	"FROM `erpota`.`prosvasi` " .
	"WHERE (`ipalilos` = " . $kodikos . ") " .
	"AND (`password` = " . pandora::sql_string(sha1($password)) . ")";
$row = pandora::first_row($query);

if ((!isset($row)) || ($row["ipalilos"] != $kodikos))
lathos("Access denied");

$ipalilos = array(
	"kodikos" => $kodikos,
	"ipiresia" => $row["ipiresia"],
	"prosvasi" => $row["level"],
);

$query = "SELECT `timi` FROM `kartel`.`parametros` WHERE `kodikos` = " .
	pandora::sql_string("erpota12");
$row = pandora::first_row($query);

if (!$row)
lathos("Ακαθόριστη έκδοση βάσης δεδομένων 'erpota'");

switch ($row["timi"]) {
case 1:
case 2:
	break;
default:
	lathos("Μη αποδεκτή έκδοση βάσης δεδομένων 'erpota'");
}

$query = "SELECT `kodikos`, `eponimo`, `onoma`, `patronimo` " .
	"FROM `erpota" . $row["timi"] . "`.`ipalilos` " .
	"WHERE `kodikos` = " . $kodikos;
$row = pandora::first_row($query);

if ((!isset($row)) || ($row["kodikos"] != $kodikos))
lathos("Ανύπαρκτος υπάλληλος");

$ipalilos["onomateponimo"] =
$row["eponimo"] . " " .
$row["onoma"] . " " .
mb_substr($row["patronimo"], 0, 3);
	
$x = json_encode(
	$ipalilos,
	JSON_FORCE_OBJECT |
	JSON_UNESCAPED_UNICODE |
	JSON_UNESCAPED_SLASHES
);

if ($x === FALSE)
lathos("Internal program error");

$_SESSION[LETRAK_SESSION_IPALILOS] = $x;
exit(0);

function lathos($s) {
	print $s;
	exit(0);
}
