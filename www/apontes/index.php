<?php
///////////////////////////////////////////////////////////////////////////////@
//
// @BEGIN
//
// @COPYRIGHT BEGIN
// Copyright (C) 2024 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
// @COPYRIGHT END
//
// @FILETYPE BEGIN
// php
// @FILETYPE END
//
// @FILE BEGIN
// www/apontes/index.php —— Σελίδα εμφάνισης απόντων ημέρας
// @FILE END
//
// @DESCRIPTION BEGIN
// Πρόκειται για τη σελίδα εμφάνισης απόντων ημέρας. Η σελίδα δέχεται ως
// παράμετρο έναν κωδικό δελτίου αποχώρησης με ονομασία "deltio".
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2024-11-08
// Created: 2024-11-07
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
