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
// www/diafores/index.php —— Σελίδα εμφάνισης διαφορών παρουσιολογίων
// @FILE END
//
// @DESCRIPTION BEGIN
// Πρόκειται για τη σελίδα εμφάνισης διαφορών παρουσιολογίου με αντίστοιχο
// προηγούμενο παρουσιολόγιο. Η σελίδα δέχεται ως παραμέτρους δύο κωδικούς
// παρουσιολογίων με ονομασίες "tre" για το υπό έλεγχο παρουσιολόγιο, και
// "pro" για το αντίστοιχο προηγούμενο.
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2022-09-21
// Created: 2022-09-17
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
	"css" => [
		"../mnt/pandora/lib/pandora",
		"../lib/pandora",
		"../lib/letrak",
		"main",
	],
])::
document_body()::
document_close();
?>
