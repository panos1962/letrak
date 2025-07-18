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
// Updated: 2025-06-19
// Updated: 2025-04-24
// Updated: 2025-04-23
// Updated: 2025-04-17
// Updated: 2025-01-22
// Updated: 2024-12-18
// Updated: 2024-11-28
// Updated: 2023-10-15
// Updated: 2023-10-13
// Updated: 2022-12-13
// Updated: 2022-03-31
// Updated: 2022-03-18
// Updated: 2022-03-13
// Updated: 2022-03-11
// Updated: 2020-11-23
// Updated: 2020-10-19
// Updated: 2020-08-08
// Updated: 2020-08-06
// Updated: 2020-06-27
// Updated: 2020-06-21
// Updated: 2020-06-14
// Updated: 2020-06-07
// Updated: 2020-05-17
// Updated: 2020-05-13
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
		<div class="formaInputLine">
			<label for="peDeltioKodikos">
				Παρουσιολόγιο
			</label>
			<input id="peDeltioKodikos" class="peDeltioPedio">
			<input id="peDeltioPerigrafi" class="peDeltioPedio">
		</div>
		<div class="formaInputLine">
			<label for="peDeltioImerominia">
				Ημερομηνία
			</label>
			<input id="peDeltioImerominia" class="peDeltioPedio">
			<div id="peDeltioProsapo" class="deltioProsapo">
			</div>
		</div>
		<div class="formaInputLine">
			<label for="peDeltioIpiresia">
				Υπηρεσία
			</label>
			<input id="peDeltioIpiresia" class="peDeltioPedio">
		</div>
		<div class="formaInputLine" id="peDeltioDiefSection">
			<label for="peDeltioDief">
				Διεύθυνση
			</label>
			<input id="peDeltioDief" class="peDeltioPedio">
		</div>
	</div>

	<div class="peFormaEnotita">
		<div class="formaInputLine">
			<label for="peIpalilosKodikos">
				Υπάλληλος
			</label>
			<input id="peIpalilosKodikos" class="peIpalilosPedio pePedioUpdate">
			<div id="peIpalilosZoom">
			</div>
			<input id="peIpalilosOnomateponimo" class="peIpalilosPedio" disabled="true">
		</div>
		<div class="formaInputLine">
			<label for="peIpalilosOrario">Ωράριο</label>
			<input id="peIpalilosOrario" class="peIpalilosPedio pePedioUpdate orarioPedio">

			<div class="mazi">
				<div id="peKatagrafiPliktro" title="Κλικ για έλεγχο καταγραφών"></div>
				<label for="peIpalilosKarta">Κάρτα</label>
				<input id="peIpalilosKarta" class="peIpalilosPedio pePedioUpdate">
				<div id="peIpoptoPliktro" title="Επόμενη ύποπτη εγγραφή"></div>
				<div id="peApoOrarioPliktro" title="Αυτόματη συμπλήρωση από ωράριο"></div>
			</div>
		</div>
		<div class="formaInputLine">
			<label id="peMeraoraLabel" for="peMeraora"></label>
			<input id="peMeraora" class="peParousiaPedio pePedioUpdate">
			<div id="peIsozigio"></div>
			<div id="peKatharismosPliktro"></div>
		</div>
	</div>

	<div class="peFormaEnotita">
		<div class="formaInputLine">
			<label for="peAdidos">
				Άδεια
			</label>
			<select id="peAdidos" class="peParousiaPedio pePedioUpdate">
			<option value="" selected="true"></option>

			<option value="ΚΑΝΟΝΙΚΗ" class="peAdidosOmadaKanoniki">ΚΑΝΟΝΙΚΗ</option>
			<option value="ΚΑΝΟΝΙΚΗ (ΜΕΤΑΦΟΡΑ)" class="peAdidosOmadaKanoniki">ΚΑΝΟΝΙΚΗ (ΜΕΤΑΦΟΡΑ)</option>
			<option value="ΤΗΛΕΡΓΑΣΙΑ" class="peAdidosOmadaKanoniki">ΤΗΛΕΡΓΑΣΙΑ</option>
			<option value="ΕΚ ΠΕΡΙΤΡΟΠΗΣ" class="peAdidosOmadaKanoniki">ΕΚ ΠΕΡΙΤΡΟΠΗΣ</option>
			<option value="ΑΡΘΡΟ 55" class="peAdidosOmadaKanoniki">ΑΡΘΡΟ 55</option>

			<option value="ΑΣΘΕΝΕΙΑ" class="peAdidosOmadaIgia">ΑΣΘΕΝΕΙΑ</option>
			<option value="ΑΝΑΡΡΩΤΙΚΗ" class="peAdidosOmadaIgia">ΑΝΑΡΡΩΤΙΚΗ</option>
			<option value="ΑΣΘΕΝΕΙΑ ΤΕΚΝΟΥ" class="peAdidosOmadaIgia">ΑΣΘΕΝΕΙΑ ΤΕΚΝΟΥ</option>
			<option value="ΑΙΜΟΔΟΣΙΑ" class="peAdidosOmadaIgia">ΑΙΜΟΔΟΣΙΑ</option>
			<option value="ΚΑΤ' ΟΙΚΟΝ ΠΕΡΙΟΡΙΣΜΟΣ" class="peAdidosOmadaIgia">ΚΑΤ' ΟΙΚΟΝ ΠΕΡΙΟΡΙΣΜΟΣ</option>
			<option value="ΙΑΤΡΙΚΕΣ ΕΞΕΤΑΣΕΙΣ" class="peAdidosOmadaIgia">ΙΑΤΡΙΚΕΣ ΕΞΕΤΑΣΕΙΣ</option>

			<option value="ΓΟΝΙΚΗ ΣΧΟΛ. ΕΠΙΔ." class="peAdidosOmadaGoniki">ΓΟΝΙΚΗ ΣΧΟΛ. ΕΠΙΔ.</option>
			<option value="ΓΟΝΙΚΗ ΑΝΑΤΡΟΦΗΣ" class="peAdidosOmadaGoniki">ΓΟΝΙΚΗ ΑΝΑΤΡΟΦΗΣ</option>
			<option value="ΚΥΗΣΕΩΣ & ΛΟΧΕΙΑΣ" class="peAdidosOmadaGoniki">ΚΥΗΣΕΩΣ &amp; ΛΟΧΕΙΑΣ</option>

			<option value="ΡΕΠΟ ΑΙΜΟΔΟΣΙΑΣ" class="peAdidosOmadaRepo">ΡΕΠΟ ΑΙΜΟΔΟΣΙΑΣ</option>
			<option value="ΡΕΠΟ ΥΠΕΡΩΡΙΑΣ" class="peAdidosOmadaRepo">ΡΕΠΟ ΥΠΕΡΩΡΙΑΣ</option>
			<option value="ΡΕΠΟ ΑΝΑΠΑΥΣΗΣ" class="peAdidosOmadaRepo">ΡΕΠΟ ΑΝΑΠΑΥΣΗΣ</option>
			<option value="ΡΕΠΟ ΔΗΜΑΡΧΟΥ" class="peAdidosOmadaRepo">ΡΕΠΟ ΔΗΜΑΡΧΟΥ</option>
			<option value="ΡΕΠΟ ΕΦΟΡΕΥΤΙΚΗΣ" class="peAdidosOmadaRepo">ΡΕΠΟ ΕΦΟΡΕΥΤΙΚΗΣ</option>
			<option value="ΣΥΜΠΛΗΡΩΣΗ ΩΡΑΡΙΟΥ" class="peAdidosOmadaRepo">ΣΥΜΠΛΗΡΩΣΗ ΩΡΑΡΙΟΥ</option>

			<option value="ΕΙΔΙΚΗ ΑΔΕΙΑ" class="peAdidosOmadaIdiki">ΕΙΔΙΚΗ ΑΔΕΙΑ</option>
			<option value="ΣΕΜΙΝΑΡΙΟ" class="peAdidosOmadaIdiki">ΣΕΜΙΝΑΡΙΟ</option>
			<option value="ΣΠΟΥΔΑΣΤΙΚΗ" class="peAdidosOmadaIdiki">ΣΠΟΥΔΑΣΤΙΚΗ</option>
			<option value="ΣΥΝΔΙΚΑΛΙΣΤΙΚΗ" class="peAdidosOmadaIdiki">ΣΥΝΔΙΚΑΛΙΣΤΙΚΗ</option>
			<option value="ΓΑΜΟΥ" class="peAdidosOmadaIdiki">ΓΑΜΟΥ</option>
			<option value="ΠΕΝΘΟΥΣ" class="peAdidosOmadaIdiki">ΠΕΝΘΟΥΣ</option>
			<option value="ΕΚΛΟΓΙΚΗ" class="peAdidosOmadaIdiki">ΕΚΛΟΓΙΚΗ</option>
			<option value="ΑΘΛΗΤΙΚΗ" class="peAdidosOmadaIdiki">ΑΘΛΗΤΙΚΗ</option>
			<option value="ΔΙΚΑΣΤΗΡΙΟ" class="peAdidosOmadaIdiki">ΔΙΚΑΣΤΗΡΙΟ</option>
			<option value="ΣΤΡΑΤΙΩΤΙΚΗ" class="peAdidosOmadaIdiki">ΣΤΡΑΤΙΩΤΙΚΗ</option>

			<option value="ΕΚΤΟΣ ΕΔΡΑΣ" class="peAdidosOmadaAtono">ΕΚΤΟΣ ΕΔΡΑΣ</option>
			<option value="ΕΣΩΤΕΡΙΚΗ ΔΙΑΘΕΣΗ" class="peAdidosOmadaAtono">ΕΣΩΤΕΡΙΚΗ ΔΙΑΘΕΣΗ</option>
			<option value="ΑΠΕΡΓΙΑ" class="peAdidosOmadaAtono">ΑΠΕΡΓΙΑ</option>
			<option value="ΑΝΕΥ ΑΠΟΔΟΧΩΝ" class="peAdidosOmadaAtono">ΑΝΕΥ ΑΠΟΔΟΧΩΝ</option>
			<option value="ΑΠΟΣΠΑΣΗ" class="peAdidosOmadaAtono">ΑΠΟΣΠΑΣΗ</option>
			<option value="ΔΙΑΘΕΣΙΜΟΤΗΤΑ" class="peAdidosOmadaAtono">ΔΙΑΘΕΣΙΜΟΤΗΤΑ</option>
			<option value="ΑΡΓΙΑ" class="peAdidosOmadaAtono">ΑΡΓΙΑ</option>
			<option value="ΛΥΣΗ ΣΧ. ΕΡΓΑΣΙΑΣ" class="peAdidosOmadaAtono">ΛΥΣΗ ΣΧ. ΕΡΓΑΣΙΑΣ</option>
			<option value="ΜΕΤΑΚΙΝΗΣΗ" class="peAdidosOmadaAtono">ΜΕΤΑΚΙΝΗΣΗ</option>
			<option value="ΑΔΙΚΑΙΟΛΟΓΗΤΗ ΑΠΟΥΣΙΑ" class="peAdidosOmadaAtono">ΑΔΙΚΑΙΟΛΟΓΗΤΗ ΑΠΟΥΣΙΑ</option>
			</select>

			<div class="mazi">
				<label for="peAdapo">Από</label>
				<input id="peAdapo" class="peParousiaPedio pePedioUpdate">
				<label for="peAdeos">Έως</label>
				<input id="peAdeos" class="peParousiaPedio pePedioUpdate">
			</div>
		</div>
	</div>

	<div class="peFormaEnotita" style="position: relative;">
		<div class="formaInputLine">
			<label for="peExcuse">
				Εξαίρεση
			</label>
			<select id="peExcuse" class="peParousiaPedio pePedioUpdate">
			<option value="" selected="true"></option>
			<option value="ΕΝΤΑΞΕΙ">ΕΝΤΑΞΕΙ</option>
			<option value="ΕΚΤΟΣ ΕΔΡΑΣ">ΕΚΤΟΣ ΕΔΡΑΣ</option>
			<option value="ΒΑΡΔΙΑ">ΒΑΡΔΙΑ</option>
			<option value="ΓΟΝΙΚΗ">ΓΟΝΙΚΗ</option>
			<option value="ΑΙΜΟΔΟΣΙΑ">ΑΙΜΟΔΟΣΙΑ</option>
			<option value="ΕΟΡΤΗ">ΕΟΡΤΗ</option>
			<option value="ΑΣΘΕΝΕΙΑ">ΑΣΘΕΝΕΙΑ</option>
			<option value="ΠΕΝΘΟΣ">ΠΕΝΘΟΣ</option>
			<option value="ΕΚΤΑΚΤΩΣ">ΕΚΤΑΚΤΩΣ</option>
			</select>

			<div id="peVardiaPliktro" title="Αυτόματη εξαίρεση βάρδιας"></div>
			<div id="peClearExeresiPliktro" title="Καθαρισμός"></div>
		</div>
		<div class="formaInputLine">
			<label for="peInfo">
				Παρατηρήσεις
			</label>
			<textarea id="peInfo" maxlength="4000"
				class="peParousiaPedio pePedioUpdate">
			</textarea>
		</div>
		<div id="peKatagrafi" class="peParousiaPedio pePedioUpdate"></div>
	</div>

	<div id="pePanel">
		<input id="pePliktroIpovoli" class="prosopaPliktroUpdate"
			type="submit" value="Υποβολή">
		<input id="pePliktroDiagrafi" class="prosopaPliktroUpdate"
			type="button" value="Διαγραφή">
		<input id="pePliktroEpanafora" class="prosopaPliktroUpdate"
			type="button" value="Επαναφορά">
		<input id="pePliktroAkiro" type="button" value="Άκυρο">
	</div>
	<div id="peAlagiOkIndicator">
		Ok!
	</div>

	<div id="orarioEpilogi">
	</div>
</form>

<div id="filtra">
<input type="checkbox" id="filtroApontes">
<label for="filtroApontes">Απόντες</label><br>
<input type="checkbox" id="filtroParontes">
<label for="filtroParontes">Παρόντες</label><br>
<input type="checkbox" id="filtroTilergasia">
<label for="filtroTilergasia">Τηλεργασία</label><br>
<input type="checkbox" id="filtroApantes">
<label for="filtroApantes">Άπαντες</label><br>
</div>

<div id="ergalia">
	<div class="ergalioTab prosopaPliktroUpdate" id="prosopoInsert">
		Προσθήκη υπαλλήλου
	</div>
	<div class="ergalioTab prosopaPliktroUpdate" id="prosopaDiagrafiEpilegmenon">
		Διαγραφή επιλεγμένων
	</div>
	<div class="ergalioTab prosopaPliktroUpdate" id="prosopaDiagrafiMiEpilegmenon">
		Διαγραφή μη επιλεγμένων
	</div>
	<div class="ergalioTab prosopaPliktroUpdate" id="orarioAlagiEpilegmenon">
		Ωράριο επιλεγμένων
	</div>
	<div class="ergalioTab prosopaPliktroUpdate" id="orarioAlagiMiEpilegmenon">
		Ωράριο μη επιλεγμένων
	</div>
	<div class="ergalioTab prosopaPliktroUpdate" id="iperoriaEpilegmenon">
		Υπερωρίες επιλεγμένων
	</div>
	<div class="ergalioTab prosopaPliktroUpdate" id="iperoriaMiEpilegmenon">
		Υπερωρίες μη επιλεγμένων
	</div>
	<div class="ergalioTab prosopaPliktroUpdate" id="apoOrarioOla">
		Άντε γειά!
	</div>
	<div class="ergalioTab prosopaPliktroUpdate" id="protipoMetatropi">
		Μετατροπή σε πρότυπο
	</div>
	<div class="ergalioTab" id="deltioPlires"
		title="Αναλυτική εκτύπωση δελτίου">
		Εκτύπωση δελτίου
	</div>
	<div class="ergalioTab" id="deltioAponton"
		title="Εκτύπωση δελτίου απόντων">
		Δελτίο απόντων
	</div>
	<div class="ergalioTab" id="deltioImerisio"
		title="Εκτύπωση ημερήσιου δελτίου προσέλευσης/αποχώρησης">
		Ημερήσιο δελτίο
	</div>
</div>

<form id="protipo">
	<div id="protipoEnimerotiko">
		Με την μετατροπή του παρουσιολογίου σε πρότυπο, ουσιαστικά
		μετατρέπουμε το παρουσιολόγιο σε ομάδα υπαλλήλων προκειμένου
		το ανά χείρας παρουσιολόγιο να χρησιμοποιηθεί σε δεύτερο
		χρόνο ως πρότυπο για νέα παρουσιολόγια προσέλευσης ή
		αποχώρησης των υπαλλήλων της συγκεκριμένης ομάδας.
		Τα ωράρια των υπαλλήλων θα διαγραφούν, όπως επίσης θα
		διαγραφούν και τυχόν άδειες που περιέχονται στο παρουσιολόγιο.
		Επίσης, θα αναιρεθούν τυχόν κυρώσεις των υπογραφόντων.
		Τέλος, το παρουσιολόγιο θα αποκοπεί από τη σειρά παρουσιολογίων
		στην οποία, ενδεχομένως, ανήκει.
		<br>
		<p>
		<b>
		Αν δεν είστε βέβαιοι για την μετατροπή του παρουσιολογίου
		σε πρότυπο, πατήστε το πλήκτρο ακύρωσης.
		</b>
		</p>
	</div>

	<div class="formaInputLine">
		<label for="protipoPerigrafi">
			Περιγραφή
		</label>
		<input id="protipoPerigrafi">
	</div>

	<div class="formaInputLine">
		<label for="protipoOrario">
			Ωράριο
		</label>
		<input id="protipoOrario" class="orarioPedio">
		<div id="protipoOrarioInfo">
			συμπληρώστε ωράριο για όλους (προαιρετικό)
		</div>
	</div>

	<div id="protipoPanel">
		<input id="protipoPliktroMetatropi" type="submit" value="Μετατροπή">
		<input id="protipoPliktroAkiro" type="button" value="Άκυρο">
	</div>
</form>
<?php
pandora::
document_close();
?>
