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
// www/admin/index.php —— Βασική σελίδα διαχειριστή συστήματος (admin)
// @FILE END
//
// @DESCRIPTION BEGIN
// Πρόχειρη σελίδα στην οποία έχουν πρόσβαση μόνο οι διαχειριστές τού
// συστήματος, δηλαδή όσοι έχουν πρόσβαση ADMIN σε ΟΛΕΣ τις υπηρεσίες.
// Επί του παρόντος η σελίδα αυτή χρησιμοποιείται για γρήγορη πρόσβαση
// στο ιστορικό συμβάντων με βάση τον υπάλληλο ή τον αριθμό κάρτας.
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Created: 2022-03-07
// Created: 2022-03-05
// @HISTORY END
//
// @END
//
///////////////////////////////////////////////////////////////////////////////@

require_once("../../local/conf.php");
require_once(LETRAK_BASEDIR . "/www/lib/letrak.php");

pandora::
session_init()::
document_head([
	"title" => "letrak",
	"css" => [
		"../mnt/pandora/lib/pandora",
		"../lib/pandora",
		"../lib/letrak",
		"main",
	],
]);

pandora::
document_body("display: none;");

?>
<div id="ilist">
<table id="ilistTable">
<thead>
<tr>
<th class="ilistKodikos">
Κωδ.
</th>
<th class="ilistEponimo">
Επώνυμο
</th>
<th class="ilistOnoma">
Όνομα
</th>
<th class="ilistPatronimo">
Πατ.
</th>
<th class="ilistKarta">
Κάρτα
</th>
<th class="ilistIpemail">
Account
</th>
<th class="ilistPremail">
Προσωπικό email
</th>
</tr>
</thead>
<tbody id="ilistTbody">
</tbody>
</table>
</div>
<?php

pandora::
document_close();
?>
