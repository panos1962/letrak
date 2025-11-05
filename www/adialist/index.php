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
// www/adialist/index.php —— Σελίδα γρήγορης εκτύπωσης αδειών υπαλλήλου
// @FILE END
//
// @DESCRIPTION BEGIN
// Το παρόν πρόγραμμα δημιουργεί πρόχειρο report αδειών υπαλλήλου κατ' έτος.
// Πιο συγκεκριμένα, δίνουμε ως παράμετρο "etos" το έτος και ως παράμετρο
// "ipalilos" τον κωδικό υπαλλήλου, και το πρόγραμμα εκτυπώνει (ως text) τις
// άδειες του δοθέντος υπαλλήλου για το δοθέν έτος.
//
// Η εκτύπωση περιλαμβάνει δύο σκέλη: Στο πρώτο σκέλος εμφανίζονται οι άδειες
// αναλυτικά, ενώ στο δεύτερο σκέλος εμφανίζονται οι άδειες συγκεντρωτικά
// κατά είδος.
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Created: 2025-11-05
// @HISTORY END
//
// @END
//
///////////////////////////////////////////////////////////////////////////////@

define("SEP", " | ");
define("GRA", "_________________________________________________________\n\n");

require_once("../../local/conf.php");
require_once(LETRAK_BASEDIR . "/www/lib/letrak.php");

pandora::
header_data()::
session_init()::
database();

if (!array_key_exists("letrak_session_ipalilos", $_SESSION))
exit("Διαπιστώθηκε ανώνυμη χρήση!");

letrak::prosvasi_check();

$err = FALSE;

$x = pandora::parameter_get("ipalilos");

if (!$x)
$x = json_decode($_SESSION["letrak_session_ipalilos"])->kodikos;

$ipalilos = intval($x);

if ($ipalilos != $x) {
	print $x . ": λανθασμένος κωδικός υπαλλήλου!\n";
	$err = TRUE;
}

$x = pandora::parameter_get("etos");

if (!$x)
$etos = date("Y");

else {
	$etos = intval($x);

	if (($etos != $x) || ($etos < 2020) || ($etos > 2100)) {
		print $x . ": λανθασμένο έτος!\n";
		$err = TRUE;
	}
}

if ($err)
exit(1);

$query = "SELECT `eponimo`, `onoma`, `patronimo`" .
" FROM " . letrak::erpota12("ipalilos") .
" WHERE `kodikos` = " . $ipalilos;
$row = pandora::first_row($query, MYSQLI_NUM);

if (!$row)
exit("Δεν βρέθηκε ο υπάλληλος!");

print "[ " . $ipalilos . "] " .
$row[0] . " " .
$row[1] . " " .
mb_substr($row[2], 0, 3) . PHP_EOL;
print "Report αδειών έτους " . $etos . PHP_EOL;
print GRA;


$query = "SELECT `adidos`, `adapo`, `adeos`, `info`" .
" FROM `letrak`.`parousia`" .
" WHERE `ipalilos` = " . $ipalilos .
" AND `deltio` IN (" .
	" SELECT `kodikos`" .
	" FROM `letrak`.`deltio`" .
	" WHERE `imerominia` BETWEEN '" . $etos . "-01-01'" .
	" AND '" . $etos . "-12-31'" .
	" AND `prosapo` = 'ΠΡΟΣΕΛΕΥΣΗ'" .
")" .
" AND `adidos` IS NOT NULL" .
" ORDER BY `deltio`";

$count = 0;
$total = [];

$result = pandora::query($query);

while ($row = $result->fetch_array(MYSQLI_NUM)) {
	print
	$row[0] . SEP .
	$row[1] . SEP .
	$row[2] . SEP .
	$row[3] . PHP_EOL;

	if (array_key_exists($row[0], $total))
	$total[$row[0]]++;

	else
	$total[$row[0]] = 1;

	$count++;
}

if (!$count)
exit(0);

print GRA;

foreach ($total as $idos => $meres)
print $idos . ": " . $meres . PHP_EOL;

$result->close();
exit(0);
?>
