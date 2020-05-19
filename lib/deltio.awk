#!/usr/bin/env awk -f

###############################################################################@
#
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
# lib/deltio.awk —— Δημιουργία παρουσιολογίων με βάση τον κωδικό υπηρεσίας
# @FILE END
#
# @DESCRIPTION BEGIN
# Το παρόν πρόγραμμα διαβάζει κωδικούς υπηρεσιών και δημιουργεί παρουσιολόγια
# που αφορούν στις συγκεκριμένες υπηρεσίες. Στο input μπορούν να υπάρχουν και
# επιπλέον πεδία χωρισμένα μεταξύ τους με tabs. Το δεύτερο πεδίο είναι η
# περιγραφή του παρουσιολογίου και το τρίτο πεδίο είναι ο τύπος (προσέλευση ή
# αποχώρηση, default προσέλευση).
# @DESCRIPTION END
#
# @HISTORY BEGIN
# Updated: 2020-05-09
# Created: 2020-04-21
# @HISTORY END
#
# @END
#
###############################################################################@

@include "/var/opt/pandora/lib/pandora.awk"
@include "/var/opt/kartel/lib/karteldb.awk"

BEGIN {
	FS = "\t"
	spawk_verbose = 0

	if (verbose == "")
	verbose = 1

	if (!creator)
	pd_fatal("Δεν έχει καθοριστεί κωδικός υπαλλήλου (creator)")

	if (!imerominia)
	imerominia = strftime("%Y-%m-%d")

	prosapo_valid["ΠΡΟΣΕΛΕΥΣΗ"]
	prosapo_valid["ΑΠΟΧΩΡΗΣΗ"]

	if (spawk_submit("SET AUTOCOMMIT = 0") != 2)
	pd_fatal("cannot set autocommit off")

	select_ipiresia()
	select_ipalilos()
}

NF < 1 {
	next
}

# Το πρώτο πεδίο είναι κωδικός υπηρεσίας με βάση τον οποίο θα επιλεγούν
# οι υπάλληλοι που θα συμμετέχουν στο νέο παρουσιολόγιο. Δεν είναι
# απαραίτητο να υπάρχουν άλλα πεδία, αλλά εφόσον υπάρχουν ερμηνεύονται
# ως εξής: δεύτερο πεδίο είναι η περιγραφή του νέου παρουσιολογίου και
# τρίτο πεδίο είναι ο τύπος (προσέλευση/αποχώρηση).

$1 !~ /^[ΑΒΓΔΕ][0-9][0-9]/ {
	pd_errmsg($1 ": μη αποδεκτός κωδικός υπηρεσίας")
	next
}

{
	add_deltio($1, $2, $3)
}

function add_deltio(kodip, perigrafi, prosapo,		query,
	deltio, l, i, count) {

	if (!prosapo)
	prosapo = "ΠΡΟΣΕΛΕΥΣΗ"

	if (prosapo in prosapo_valid)
	prosapo = spawk_escape(prosapo)

	else
	return pd_errmsg(prosapo ": μη αποδεκτός τύπος παρουσιολογίου")

	if (!perigrafi)
	perigrafi = ipiresia[kodip]

	perigrafi = (perigrafi ? spawk_escape(perigrafi) : "NULL")

	query = "START TRANSACTION"

	if (spawk_submit(query) != 2)
	pd_fatal("Αδυναμία εκκίνησης νέας transaction")

	query = "INSERT INTO `letrak`.`deltio` " \
		"(`ipalilos`, `imerominia`, `ipiresia`, " \
		"`prosapo`, `perigrafi`, `alagi`) VALUES (" \
		creator ", '" imerominia "', " spawk_escape(kodip) ", " \
		prosapo ", " perigrafi ", NOW())"

	if (spawk_submit(query) != 2)
	return pd_errmsg($0 ": αποτυχία δημιουργίας νέου παρουσιολογίου")

	deltio = spawk_insertid
	l = length(kodip)

	for (i in ipalilos) {
		if ((substr(ipalilos[i]["die"], 0, l) == kodip) ||
		(substr(ipalilos[i]["tmi"], 0, l) == kodip) ||
		(substr(ipalilos[i]["gra"], 0, l) == kodip))
		count += add_ipalilos(deltio, i)
	}

	if (!count) {
		if (verbose)
		pd_errmsg(kodip ": δεν βρέθηκαν υπάλληλοι στην υπηρεσία")

		if (spawk_submit("ROLLBACK WORK") != 2)
		pd_fatal("rollback transaction failed")

		return
	}

	if (spawk_submit("COMMIT WORK") != 2)
	pd_fatal("commit transaction failed")

	if (verbose)
	print kodip, deltio, count
}

function add_ipalilos(deltio, kodikos,		karta, query) {
	karta = ipalilos[kodikos]["karta"] + 0

	if (!karta)
	karta = "NULL"

	query = "INSERT INTO `letrak`.`parousia` " \
		"(`deltio`, `ipalilos`, `karta`) " \
		"VALUES (" deltio ", " kodikos ", " karta ")"

	if (spawk_submit(query) != 2)
	pd_fatal("αποτυχία ένταξης υπαλλήλου")

	return 1
}

function select_ipalilos(			query, row) {
	query = "SELECT `kodikos`" \
		" FROM " kartel_erpotadb("ipalilos") \
		" WHERE `katastasi` = 'ΕΝΕΡΓΟΣ'"

	if (spawk_submit(query, 2) != 3)
	pd_fatal("Αποτυχία επιλογής ενεργών υπαλλήλων")

	while (spawk_fetchrow(row)) {
		row["dateFetch"] = strftime("%Y-%m-%d")
		kartel_ipalilos_metavoli_fetch(row)

		ipalilos[row["kodikos"]]["die"] = row["ipidie"]
		ipalilos[row["kodikos"]]["tmi"] = row["ipitmi"]
		ipalilos[row["kodikos"]]["gra"] = row["ipigra"]
		ipalilos[row["kodikos"]]["karta"] = row["karta"]
	}
}

function select_ipiresia(			query, row) {
	query = "SELECT `kodikos`, `perigrafi`" \
		" FROM " kartel_erpotadb("ipiresia")

	if (spawk_submit(query, 1) != 3)
	pd_fatal("Αποτυχία σαρώματος υπηρεσιών")

	while (spawk_fetchrow(row)) {
		if (row[1] ~ /^[ΑΒΓΔΕ][0-9][0-9]/)
		ipiresia[row[1]] = row[2]
	}
}
