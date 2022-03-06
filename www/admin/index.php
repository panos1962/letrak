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

// Στο σημείο αυτό διαβάζουμε τα δεδομένα προσωπικού από το σχετικό link
// που δείχνει στη νεότερη version των δεδομένων αυτών.

?>
<script src="../public/erpotaData.js" async></script>
<?php

pandora::
document_body("display: none;");

?>
<div id="kritiriaForma">
	<div class="letrak-inputLine">
		<label for="kritiriaFormaKodikos">
			Κωδικός
		</label>
		<input id="kritiriaFormaKodikos" tabindex="-1">
	</div>
	<div class="letrak-inputLine">
		<label for="kritiriaFormaEponimo">
			Επώνυμο
		</label>
		<input id="kritiriaFormaEponimo" tabindex="-1">
	</div>
	<div class="letrak-inputLine">
		<label for="kritiriaFormaOnoma">
			Όνομα
		</label>
		<input id="kritiriaFormaOnoma" tabindex="-1">
	</div>
	<div class="letrak-inputLine">
		<label for="kritiriaFormaKarta">
			Αρ. Κάρτας
		</label>
		<input id="kritiriaFormaKarta" tabindex="-1">
	</div>
</div>
<?php

pandora::
document_close();
?>
