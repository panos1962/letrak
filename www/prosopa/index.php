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
// www/prosopa/index.php —— Σελίδα επεξεργασίας παρουσιολογίου
// @FILE END
//
// @DESCRIPTION BEGIN
// Πρόκειται για τη σελίδα επεξεργασίας παρουσιολογίου. Στη συγκεκριμένη σελίδα
// μπορούμε να καταχωρήσουμε βασικά στοιχεία του παρουσιολογίου, π.χ. τον τύπο,
// την ημερομηνία, την υπηρεσία, τους υπογράφοντες κλπ. Ωστόσο, βασικός σκπός
// της σελίδας είναι η επεξεργασία των πληροφοριών που αφορούν στην προσέλευση,
// ή στην αποχώρηση των συμμετεχόντων.
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2020-05-07
// Updated: 2020-04-25
// Created: 2020-04-24
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
document_body();
?>
<form id="parousiaEditor">
	<div class="formaEnotita">
		<div class="formaInputLine">
			<label for="peImerisioKodikos">
				Παρουσιολόγιο
			</label>
			<input id="peImerisioKodikos">
			<input id="peImerisioPerigrafi">
		</div>
		<div class="formaInputLine">
			<label for="peImerisioIpiresia">
				Υπηρεσία
			</label>
			<textarea id="peIpalilosIpiresiaPerigrafi">
			</textarea>
		</div>
	</div>

	<div class="formaEnotita">
		<div class="formaInputLine">
			<label for="peIpalilosKodikos">
				Υπάλληλος
			</label>
			<input id="peIpalilosKodikos">
			<input id="peIpalilosOnomateponimo">
		</div>
		<div class="formaInputLine">
			<label for="peImerisioIpiresia">
				Υπηρεσία
			</label>
			<textarea id="peIpalilosIpiresiaPerigrafi">
			</textarea>
		</div>
		<div class="formaInputLine">
			<label for="peIpalilosOrario">
				Ωράριο
			</label>
			<input id="peIpalilosOrario">
			<label for="peIpalilosKarta">
				Κάρτα
			</label>
			<input id="peIpalilosKarta">
		</div>
	</div>
</form>
<?php
pandora::
document_close();
?>
