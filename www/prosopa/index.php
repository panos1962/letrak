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
// Updated: 2020-05-09
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
	<div class="peFormaEnotita">
		<div class="peFormaInputLine">
			<label for="peDeltioKodikos">
				Παρουσιολόγιο
			</label>
			<input id="peDeltioKodikos" disabled="true">
			<input id="peDeltioPerigrafi" disabled="true">
		</div>
		<div class="peFormaInputLine">
			<label for="peDeltioImerominia">
				Ημερομηνία
			</label>
			<input id="peDeltioImerominia" disabled="true">
			<label for="peDeltioProsapo">
				Είδος
			</label>
			<div id="peDeltioProsapo" class="deltioProsapo">
			</div>
		</div>
		<div class="peFormaInputLine">
			<label for="peDeltioIpiresia">
				Υπηρεσία
			</label>
			<textarea id="peDeltioIpiresia"
				disabled="true">
			</textarea>
		</div>
	</div>

	<div class="peFormaEnotita">
		<div class="peFormaInputLine">
			<label for="peIpalilosKodikos">
				Υπάλληλος
			</label>
			<input id="peIpalilosKodikos">
			<input id="peIpalilosOnomateponimo">
		</div>
		<div class="peFormaInputLine">
			<label for="peIpalilosOrario">
				Ωράριο
			</label>
			<input id="peIpalilosOrario">
			<label for="peIpalilosKarta">
				Κάρτα
			</label>
			<input id="peIpalilosKarta">
			<label for="peKartaMeraora">
				Καταγραφή
			</label>
			<input id="peKartaMeraora">
		</div>
		<div class="peFormaInputLine">
			<label id="peMeraoraLabel" for="peMeraora">
			</label>
			<input id="peMeraora">
		</div>
	</div>

	<div class="peFormaEnotita">
		<div class="peFormaInputLine">
			<label for="peAdiaIdos">
				Άδεια
			</label>
			<input id="peAdiaIdos">
			<input id="peAdiaPerigrafi" disabled="true">
		</div>
		<div class="peFormaInputLine">
			<label for="peAdiaApo">
				Από
			</label>
			<input id="peAdiaApo">
			<label for="peAdiaEos">
				Έως
			</label>
			<input id="peAdiaEos">
		</div>
	</div>

	<div class="peFormaEnotita">
		<div class="peFormaInputLine">
			<label for="peExcuse">
				Εξαίρεση
			</label>
			<select id="peExcuse">
			<option value="" selected="true"></option>
			<option value="ΕΚΤΟΣ ΕΔΡΑΣ">ΕΚΤΟΣ ΕΔΡΑΣ</option>
			<option value="ΑΙΜΟΔΟΣΙΑ">ΑΙΜΟΔΟΣΙΑ</option>
			<option value="ΕΟΡΤΗ">ΕΟΡΤΗ</option>
			<option value="ΑΣΘΕΝΕΙΑ">ΑΣΘΕΝΕΙΑ</option>
			<option value="ΠΕΝΘΟΣ">ΠΕΝΘΟΣ</option>
			<option value="ΕΚΤΑΚΤΩΣ">ΕΚΤΑΚΤΩΣ</option>
			</select>
		</div>
		<div class="peFormaInputLine">
			<label for="peInfo">
				Παρατηρήσεις
			</label>
			<textarea id="peInfo" maxlength="140">
			</textarea>
		</div>
	</div>

	<div id="pePanel">
		<input id="pePliktroAkiro" type="button" value="Άκυρο">
		<input id="pePliktroEpanafora" type="button" value="Επαναφορά">
		<input id="pePliktroIpovoli" type="button" value="Υποβολή">
	</div>
</form>
<?php
pandora::
document_close();
?>
