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
// www/prosopa/diagrafiEpligemenon.php —— Διαγραφή συγκεκριμένων υπαλλήλων.
// @FILE END
//
// @DESCRIPTION BEGIN
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Created: 2025-04-17
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

$deltio_kodikos = pandora::parameter_get("deltio");

if (letrak::deltio_invalid_kodikos($deltio_kodikos))
lathos("Μη αποδεκτός κωδικός παρουσιολογίου");

$deltio = (new Deltio())->from_database($deltio_kodikos);

if ($deltio->oxi_kodikos())
lathos($kodikos . ": δεν εντοπίστηκε το παρουσιολόγιο");

if ($deltio->is_klisto())
lathos("Το παρουσιολόγιο έχει επικυρωθεί");

if ($deltio->is_ipogegrameno())
lathos("Το παρουσιολόγιο έχει κυρωθεί");

if ($prosvasi->oxi_deltio_edit($deltio_kodikos))
lathos("Access denied");

$plist = pandora::parameter_get("plist");

if (!is_array($plist))
lathos("Ακαθόριστοι υπάλληλοι προς διαγραφή");

$plist_count = count($plist);

if ($plist_count <= 0)
lathos("Δεν επελέγησαν υπάλληλοι προς διαγραφή");

///////////////////////////////////////////////////////////////////////////////@

$query = "DELETE FROM `letrak`.`parousia`" .
	" WHERE (`deltio` = " . $deltio_kodikos . ")" .
	" AND (`ipalilos` IN (" . $plist[0];

for ($i = 1; $i < $plist_count; $i++)
$query .= ", " . $plist[$i];

$query .= "))";
pandora::query($query);

exit(0);

function lathos($s) {
	print $s;
	exit(0);
}
?>
