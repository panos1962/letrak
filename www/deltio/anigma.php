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
// www/deltio/anigma.php —— Άνοιγμα παρουσιολογίου
// @FILE END
//
// @DESCRIPTION BEGIN
// Το παρόν πρόγραμμα «ανοίγει» ένα παρουσιολόγιο, τουτέστιν το καθιστά
// προσβάσιμο σε περαιτέρω αλλαγές. Δικαίωμα να κλείσει ένα παρουσιολόγιο
// έχει μόνο κάποιος με πρόσβαση "ADMIN" στην υπηρεσία του παρουσιολογίου
// ή σε γονική υπηρεσία.
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2020-05-18
// Updated: 2020-05-11
// Updated: 2020-05-06
// Updated: 2020-05-04
// Created: 2020-05-03
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
letrak::fatal_error("Διαπιστώθηκε ανώνυμη χρήση");

$kodikos = pandora::parameter_get("kodikos");

if (pandora::not_integer($kodikos, 1, LETRAK_DELTIO_KODIKOS_MAX))
letrak::fatal_error("Μη αποδεκτός κωδικός παρουσιολογίου");

$deltio = (new Deltio())->from_database($kodikos);

if ($deltio->oxi_kodikos())
letrak::fatal_error($kodikos . ": δεν εντοπίστηκε το παρουσιολόγιο");

if ($deltio->is_anikto())
letrak::fatal_error($kodikos . ": το παρουσιολόγιο είναι ήδη «ανοικτό»");

$ipiresia = $deltio->ipiresia_get();

if ($prosvasi->ipiresia_oxi_admin($ipiresia))
letrak::fatal_error("Δεν έχετε δικαίωμα «ανοίγματος» παρουσιολογίου");

///////////////////////////////////////////////////////////////////////////////@

$query = "UPDATE `letrak`.`deltio` SET `katastasi` = " .
	pandora::sql_string(LETRAK_DELTIO_KATASTASI_KIROMENO) . "," .
	" `alagi` = NOW() WHERE `kodikos` = " . $kodikos;
pandora::query($query);

if (pandora::affected_rows() != 1)
letrak::fatal_error("Αποτυχία «ανοίγματος» παρουσιολογίου");
?>
