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
// www/isodos/index.php —— Φόρμα εισόδου στην εφαρμογή "letrak"
// @FILE END
//
// @DESCRIPTION BEGIN
// Πρόκειται για τη σελίδα εισόδου στην εφαρμογή των παρουσιολογίων. Η σελίδα
// εμφανίζει φόρμα εισόδου με δύο πεδία, τον αριθμό μητρώου εργαζομένου και το
// password. Εφόσον ο χρήστης δώσει τα σωστά στοιχεία, δημιουργούνται session
// cookie items "ipalilos", "ipiresia" και "prosvasi" τα οποία περιέχουν τον
// αριθμό μητρώου εργαζομένου, τον κωδικό Υπηρεσίας και το είδος της πρόσβασης
// του συγκεκριμένου υπαλλήλου. Τα είδη προσβάσεων είναι: NULL, "VIEW",
// "UPDATE" και "ADMIN". Η NULL πρόσβαση δίνει τα ελάχιστα δυνατά δικαιώματα
// που σημαίνει ότι ο υπάλληλος έχει δικαίωμα θεώρησης μόσο στα προσωπικά του
// στοιχεία. Η πρόσβαση "VIEW" δίνει δικαίωμα θεώρησης των παρουσιολογίων της
// Υπηρεσίας, ενώ η πρόσβαση "UPDATE" δίνει δικαίωμα πρόσβασης για ενημερώσεις
// στα παρουσιολόγια της Υπηρεσίας. Τέλος, η πρόσβαση "ADMIN" δίνει δικαίωμα
// ενημέρωσης σε όλα τα παρουσιολόγια.
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Created: 2020-04-14
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
	"title" => "Είσοδος",
	"css" => [
		"../mnt/pandora/lib/pandora",
		"main",
	],
])::
document_body()::
document_close();
