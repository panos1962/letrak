#!/usr/bin/env awk

# @BEGIN
#
# @COPYRIGHT BEGIN
# Copyright (C) 2020 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
# @COPYRIGHT END
#
# @FILETYPE BEGIN
# awk
# @FILETYPE END
#
# @FILE BEGIN
# lib/minas/minasTotal.awk —— Μηνιαίο δελτίο αδειών (post processor)
# @FILE END
#
# @DESCRIPTION BEGIN
# @DESCRIPTION END
#
# @HISTORY BEGIN
# Created: 2021-05-12
# @HISTORY END
#
# @END

# Το παρόν διαβάζει αναλυτικά μηνιαία στοιχεία αδειών και τα μαζεύει κατά
# άδεια. Πιο συγκεκριμένα, συνενώνει τις διαδοχικές άδειες και τις εκτυπώνει
# σε μια γραμμή με ημερομηνίες αρχής και τέλους αδείας. Τα στοιχεία που
# διαβάζει το πρόγραμμα είναι:
#
#	Κωδικός υπαλλήλου
#	Ονοματεπώνυμο υπαλλήλου
#	Ημέρα της εβδομάδας
#	Ημερομηνία δελτίου
#	Είδος αδείας/παρουσίας/απουσίας
#
# Η παράμετρος "totals" δείχνει αν το πρόγραμμα πράγματι θα εκτυπώσει
# συγκεντρωτικά στοιχεία ή όχι. Για να εκτυπωθούν συγκεντρωτικά στοιχεία
# θα πρέπει η παράμετρος "totals" να είναι μη μηδενική ή μη κενή.

BEGIN {
	FS = "\t"
	OFS = "\t"
}

!totals {
	print
	next
}

NF != 5 {
	pd_errmsg($0 ": syntax error")
	next
}

{
	process_data()
}

END {
	print_data()
}

function process_data(					nf) {
	nf = 1

	ipalilos = $(nf++)	# κωδικός υπαλλήλου
	onoma = $(nf++)		# ονοματεπώνυμο υπαλλήλου
	nf++			# day of the week
	imerominia = $(nf++)	# ημερομηνία
	apa = $(nf++)		# άδεια/παρουσία/απουσία

	if (apa == "ΤΗΛΕΡΓΑΣΙΑ")
	apa = ""

	if (ipalilos != ipalilos_trexon)
	return alagi_ipalilou()

	if (apa != apa_trexon)
	return alagi_apa()

	imerominia_eos = imerominia
}

function alagi_ipalilou() {
	print_data()
	ipalilos_trexon = ipalilos
	onoma_trexon = onoma
	apa_trexon = apa
	imerominia_apo = imerominia
	imerominia_eos = imerominia
}

function alagi_apa() {
	print_data()
	apa_trexon = apa
	imerominia_apo = imerominia
	imerominia_eos = imerominia
}

function print_data() {
	if (imerominia_eos)
	print ipalilos_trexon, onoma_trexon, \
		imerominia_apo, imerominia_eos, \
		apa_trexon
}
