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
# lib/minas/minas.awk —— Μηνιαίο δελτίο αδειών
# @FILE END
#
# @DESCRIPTION BEGIN
# @DESCRIPTION END
#
# @HISTORY BEGIN
# Created: 2021-05-04
# @HISTORY END
#
# @END

# Το παρόν διαβάζει κωδικούς δελτίων προσέλευσης/αποχώρησης και εκτυπώνει στο
# standard output τους μετέχοντες υπαλλήλους των δελτίων προσέλευσης, ενώ τα
# δελτία αποχώρησης απορρίπτονται σιωπηλά. Η εκτύπωση περιλαμβάνει τα εξής:
#
#	Ονοματεπώνυμο υπαλλήλου
#	Κωδικός υπαλλήλου
#	Ημερομηνία δελτίου
#	Στοιχεία παρουσίας
#
# Το πεδίο με τα στοιχεία παρουσίας είναι κενό εφόσον ο υπάλληλος έχει
# συμπληρωμένη ώρα προσέλευσης στο δελτίο, αλλιώς περιέχει το είδος
# αδείας/αξαίρεσης. Αν δεν υπάρχει ώρα προσέλευσης ούτε άδεια/εξαίρεση,
# τότε το πεδίο περιέχει εννέα ερωτηματικά.

BEGIN {
	OFS = "\t"

	spawk_verbose = 0
	spawk_null = ""

	apousia = "?????????"
	dlist[0]

	if (www) {
		for (i = 1; i < ARGC; i++)
		process_deltio(ARGV[i])

		exit(0)
	}
}

NF < 1 {
	next
}

{
	process_deltio($1)
}

function process_deltio(kodikos,			query, deltio) {
	if (kodikos !~ /^[0-9]{1,8}$/)
	return pd_errmsg(kodikos ": λανθασμένος κωδικός δελτίου")

	if (kodikos in dlist)
	return pd_errmsg(kodikos ": το δελτίο έχει ήδη περιληφθεί")

	dlist[kodikos]

	query = "SELECT `kodikos`, DATE_FORMAT(`imerominia`, '%d‐%m‐%Y') " \
		"AS `imerominia`, `ipiresia`, `perigrafi`, `prosapo` " \
		"FROM `letrak`.`deltio` " \
		"WHERE `letrak`.`deltio`.`kodikos` = " kodikos

	if (spawk_submit(query, "ASSOC") != 3)
	return pd_errmsg(kodikos ": SQL error")

	if (!spawk_fetchone(deltio))
	return pd_errmsg(kodikos ": δεν βρέθηκε το δελτίο")

	if (deltio["prosapo"] != "ΠΡΟΣΕΛΕΥΣΗ")
	return 0

	print_deltio(deltio)
}

function print_deltio(deltio,				query, parousia) {
	query = "SELECT `ipalilos`, `adidos`, `excuse`, `meraora` " \
		"FROM `letrak`.`parousia` " \
		"WHERE `letrak`.`parousia`.`deltio` = " deltio["kodikos"]

	if (spawk_submit(query, "ASSOC") != 3)
	return pd_errmsg(kodikos ": SQL error")

	while (spawk_fetchrow(parousia))
	print_data(deltio, parousia)
}

function print_data(deltio, parousia,			adia) {
	if (parousia["meraora"])
	adia = ""

	else if (parousia["adidos"])
	adia = parousia["adidos"]

	else if (parousia["excuse"])
	adia = ""

	else
	adia = apousia

	print \
	parousia["ipalilos"], \
	ipalilos_onoma(parousia["ipalilos"]), \
	imera(deltio["imerominia"]), \
	deltio["imerominia"], \
	adia
}

function ipalilos_onoma(kodikos,			ipalilos) {
	query = "SELECT `eponimo`, `onoma`, `patronimo` " \
		"FROM `erpota1`.`ipalilos` " \
		"WHERE `erpota1`.`ipalilos`.`kodikos` = " kodikos

	if (spawk_submit(query, "ASSOC") != 3)
	return pd_errmsg(kodikos ": SQL error")

	if (!spawk_fetchone(ipalilos)) {
		pd_errmsg(kodikos ": δεν βρέθηκε ο υπάλληλος")
		return ""
	}

	return ipalilos["eponimo"] " " ipalilos["onoma"] " " \
		substr(ipalilos["patronimo"], 1, 3)
}

function imera(imerominia,				a, t) {
	if (split(imerominia, a, /[^0-9]/) != 3)
	return ""

	t = mktime(sprintf("%04d %02d %02d 00 00 00", a[3], a[2], a[1]))

	if (t < 0)
	return ""

	return strftime("%A", t)
}
