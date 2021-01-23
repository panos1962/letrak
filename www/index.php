<?php

///////////////////////////////////////////////////////////////////////////////@
//
// @BEGIN
//
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
// www/index.php —— Αρχική σελίδα εφαρμογής "letrak"
// @FILE END
//
// @DESCRIPTION BEGIN
// Πρόκειται για την αρχική σελίδα της εφαρμογής "letrak", ελέγχου και
// διαχείρισης παρουσιολογίων. Η σελίδα εμφανίζει μήνυμα υποδοχής και
// εφόσον γίνεται επώνυμη χρήση παρέχονται επιλογές επιμέρους εφαρμογών.
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Created: 2020-04-20
// @HISTORY END
//
// @END
//
///////////////////////////////////////////////////////////////////////////////@

require_once("../local/conf.php");
require_once(LETRAK_BASEDIR . "/www/lib/letrak.php");

pandora::
session_init()::
document_head([
	"title" => "Παρουσιολόγια",
	"css" => [
		"mnt/pandora/lib/pandora",
		"lib/pandora",
		"lib/letrak",
		"main",
	],
])::
document_body();
?>
<div id="welcome">
Καλωσήλθατε στην εφαρμογή <b>letrak</b> που αφορά στη δημιουργία, στον
έλεγχο, στη διαχείριση και στην εκτύπωση των παρουσιολογίων.
<span id="anonimiXrisi">
Κάντε κλικ στο πλήκτρο εισόδου που βρίσκεται στο επάνω δεξιά μέρος της
σελίδας προκειμένου να αποκτήσετε πρόσβαση σε επιμέρους σελίδες και
προγράμματα της εφαρμογής.
</span>
<span id="eponimiXrisi">
Επιλέξτε επιμέρους εφαρμογές και προγράμματα κάνοντας κλικ στα πλήκτρα
που βρίσκονται στο επάνω αριστερά μέρος της σελίδας προκειμένου να
ελέγξετε, να δημιουργήσετε, να διορθώσετε ή να εκτυπώσετε παρουσιολόγια
σύμφωνα με τις προσβάσεις που σας έχουν αποδοθεί.
</span>
<div id="readmeToggle">XXX</div>
<div id="readme">
<?php
require_once("readme.html");
?>
</div>
</div>
<?php
pandora::
document_close();
?>
