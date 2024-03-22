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
// Σελίδα αναζήτησης σθμβάντων (χτυπημάτων καρτών). Σε αυτήν τη σελίδα ο χρήστης
// καθορίζει κριτήρια αναζήτησης συμβάντων (ημερομηνία, διάστημα ωρών, υπηρεσίες
// κλπ) και το πρόγραμμα συλλέγει όλα τα σχετικά συμβάντα, τα οποία παρουσιάζει
// με τη μορφή λογιστικού φύλλου.
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Created: 2024-03-22
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
	"title" => "Checkin",
	"css" => [
		"../mnt/pandora/lib/pandora",
		"../lib/pandora",
		"../lib/letrak",
		"main",
	],
]);

pandora::
document_body();

?>
<div id="kritiriaForma">
	<div class="letrak-inputLine">
		<label for="klonismosFormaImerominia">
			Ημερομηνία
		</label>
		<input id="klonismosFormaImerominia" tabindex="-1">
	</div>
</div>
<?php

pandora::
document_close();
?>
