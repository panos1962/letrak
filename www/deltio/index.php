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
// www/deltio/index.php —— Εφαρμογή διαχείρισης παρουσιολογίων
// @FILE END
//
// @DESCRIPTION BEGIN
// Πρόκειται για τη βασική σελίδα δημιουργίας, επεξεργασίας, διαχείρισης και
// εκτύπωσης παρουσιολογίων. Στη συγκεκριμένη σελίδα έχουν πρόσβαση αρμόδιοι
// υπάλληλοι από κάθε υπηρεσία· στις περισσότερες περιπτώσεις πρόκειται για
// υπαλλήλους της διοικητικής υποστήριξης κάθε υπηρεσίας.
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2020-04-09
// Created: 2020-03-05
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
	"title" => "Παρουσιολόγια",
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
