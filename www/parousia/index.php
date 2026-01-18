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
// Σελίδα επιλογής και παρουσίασης παρουσιών συγκεκριμένου υπαλλήλου για
// συγκεκριμένο διάστημα.
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
