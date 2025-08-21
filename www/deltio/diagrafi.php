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
// www/deltio/diagrafi.php —— Διαγραφή παρουσιολογίου
// @FILE END
//
// @HISTORY BEGIN
// Updated: 2025-08-21
// Updated: 2025-08-19
// Updated: 2020-05-18
// Created: 2020-04-22
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
$kodikos = pandora::parameter_get("kodikos");

if (pandora::not_integer($kodikos, 1, LETRAK_DELTIO_KODIKOS_MAX))
letrak::fatal_error("Μη αποδεκτός κωδικός παρουσιολογίου");

$deltio = (new Deltio())->from_database($kodikos);

if ($deltio->oxi_kodikos())
letrak::fatal_error("Αδυναμία εντοπισμού παρουσιολογίου προς διαγραφή");

if ($deltio->is_klisto())
letrak::fatal_error("Το παρουσιολόγιο έχει κλείσει");

$ipiresia = $deltio->ipiresia_get();

if ($prosvasi->oxi_update_ipiresia($ipiresia))
letrak::fatal_error("Δεν έχετε δικαίωμα διαγραφής παρουσιολογίου");

///////////////////////////////////////////////////////////////////////////////@

$ipalilos = $prosvasi->ipalilos_get();

$onomateponimo = Ipalilos::onomateponimo($ipalilos);

if (!$onomateponimo)
letrak::fatal_error_json("Δεν βρέθηκε υπάλληλος με κωδικό " . $ipalilos);

$kinisi = "";
$kinisi .= $ipalilos . ":";
$kinisi .= $onomateponimo . ":";
$kinisi .= $deltio->imerominia_get("Y-m-d") . ":";
$kinisi .= $deltio->prosapo_get();

letrak::katagrafi($ipalilos, $kodikos, $ipiresia,
	"ΔΙΑΓΡΑΦΗ ΔΕΛΤΙΟΥ", $kinisi);

$query = "DELETE FROM `letrak`.`deltio` WHERE `kodikos` = " . $kodikos;
pandora::query($query);

if (pandora::affected_rows() < 1)
letrak::fatal_error("Αποτυχία διαγραφής παρουσιολογίου");
?>
