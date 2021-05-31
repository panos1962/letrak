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
// Updated: 2021-05-13
// Updated: 2020-08-02
// Updated: 2020-07-07
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
]);

// Στο σημείο αυτό διαβάζουμε τα δεδομένα προσωπικού από το σχετικό link
// που δείχνει στη νεότερη version των δεδομένων αυτών.

?>
<script src="../public/erpotaData.js" async></script>
<?php

pandora::
document_body();


// Ακολουθεί φόρμα διαλόγου που αφορά στον καθορισμό ημερομηνίας νέου
// παρουσιολογίου που δημιουργείται ως αντίγραφο υπάρχοντος παρουσιολογίου.
// Η εν λόγω φόρμα ενεργοποιείται με το πλήκτρο κλωνοποίησης και το νέο
// παρουσιολόγιο θα έχει τύπο αντίθετο από τον τύπο του προτύπου, ενώ η
// ημερομηνία του νέου παρουσιολογίου θα είναι ίδια με την ημερομηνία τού
// προτύπου εφόσον πρόκειται για παρουσιολόγιο αποχώρησης, ή σημερινή εφόσον
// πρόκειται για παρουσιολόγιο προσέλευσης. Δίνεται επίσης η δυνατότητα
// καθορισμού του νέου παρουσιολογίου ως «εναρκτήριου» που σημαίνει ότι
// στο νέο παρουσιολόγιο δεν θα έχει συμπληρωμένο το πεδίο του προτύπου
// με αποτέλεσμα αφενός το νέο παρουσιολόγιο να μπορεί να θεωρηθεί ως το
// πρώτο παρουσιολόγιο νέας σειράς παρουσιολογίων, και αφετέρου να μπορεί
// να χρησιμοποιηθεί και πάλι το πρότυπο παρουσιολόγιο για την παραγωγή
// νέου παρουσιολογίου.

?>
<div id="klonismosForma">
	<div class="letrak-inputLine">
		<label for="klonismosFormaImerominia">
			Ημερομηνία
		</label>
		<input id="klonismosFormaImerominia" tabindex="-1">
	</div>
	<div class="letrak-inputLine">
		<label for="klonismosFormaEnarktirio">
			Εναρκτήριο
		</label>
		<input id="klonismosFormaEnarktirio" tabindex="-1"
			type="checkbox" disabled="yes">
	</div>
</div>

<div id="reports">
	<div class="reportTab" id="reportAdiaImera">
		Ημερήσια εκτύπωση αδειών
	</div>
	<div class="reportTab" id="reportAdiaDiastima">
		Μηνιαία εκτύπωση αδειών
	</div>
</div>
<?php

pandora::
document_close();
?>
