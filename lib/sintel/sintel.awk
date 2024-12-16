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
# lib/sintel.awk —— Εντοπισμός συντακτών χωρίς τηλέφωνο επικοινωνίας
# @FILE END
#
# @DESCRIPTION BEGIN
# Το παρόν πρόγραμμα καλείται μέσω του προγράμματος "sintel.sh" και σκοπό
# έχει τον εντοπισμό συντακτών δελτίων των τελευταίων ημερών, οι οποίοι
# δεν έχουν καταχωρημένο τηλέφωνο επικοινωνίας.
# @DESCRIPTION END
#
# @HISTORY BEGIN
# Updated: 2024-12-16
# Updated: 2024-12-05
# Created: 2024-12-04
# @HISTORY END
#
# @END
#
###############################################################################@

@load "spawk"

BEGIN {
	init()
	select_deltio()

	exit(0)
}

function init(			serem, nok, err) {
	serem = meres + 0

	# Αν το πρόγραμμα τρέχει με αποδέκτη μέσω email, επανακτευθύνουμε
	# και τυχόν λάθη στο standard output προκειμένου να παραληφθούν
	# από τον παραλήπτη.

	if (mail) {
		errout = "/dev/stdout"
		ORS = "<br>\n"
	}

	else {
		errout = "/dev/stderr"
	}

	if (serem <= 0) {
		print progname ": " meres ": invalid days" >errout
		exit(1)
	}

	FS = "\t"
	nok = 1

	while ((err = (getline <sesamidb)) > 0) {
		spawk_sesami["dbuser"] = $1
		spawk_sesami["dbpassword"] = $2
		nok = 0
	}

	if (!err)
	close(sesamidb)

	if (nok) {
		print progname ": " sesamidb ": cannot read file" >errout
		exit(1)
	}

	spawk_sesami["dbcharset"] = "utf8"
	select_ipiresia()
}

# Η function "select_deltio" επιλέγει όλα τα δελτία των τελευταίων ημερών.
# Ως τελευταίες ημέρες λογίζονται οι ημέρες με βάση τη σημερινή ημερομηνία
# και την παράμετερο "meres".

function select_deltio(				query, deltio) {
	query = "SELECT `kodikos`, `imerominia`, `perigrafi`, `ipiresia` " \
		"FROM `letrak`.`deltio` " \
		"WHERE `imerominia` > DATE_SUB(NOW(), INTERVAL " meres " DAY)"
	spawk_submit(query, "ASSOC")

	while (spawk_fetchrow(deltio))
	process_deltio(deltio)
}

# Η function "process_deltio" δέχεται ως παράμετρο ένα record δελτίου και
# επιλέγει τον πρώτο υπογράφοντα που είναι και ο συντάκτης του δελτίου.

function process_deltio(deltio,			query, sintaktis) {
	query = "SELECT `armodios` " \
		"FROM `letrak`.`ipografi` " \
		"WHERE (`deltio` = " deltio["kodikos"] ") " \
		"AND (`taxinomisi` = 1)"
	spawk_submit(query)

	while (spawk_fetchrow(sintaktis))
	process_sintaktis(deltio, sintaktis[1])
}

# Η function "process_sintaktis" δέχεται ως παραμέτρους ένα record δελτίου
# και τον κωδικό του συντάκτη (ως υπαλλήλου) και επιλέγει το τηλέφωνο
# επικοινωνίας που είναι καταχωρημένο στον πίνακα "prosvasi" της database
# "erpota".

function process_sintaktis(deltio, sintaktis,		query, prosvasi) {
	# Η global λίστα "sincount" δεικτοδοτείται με τον κωδικό συντάκτη
	# και σκοπό έχει την αποφυγή της εκτύπωσης του ιδίου συντάκτη
	# περισσότερες από μία φορές.

	sincount[sintaktis]++

	# Αν έχουμε ήδη συναντήσει τον ανά χείρας συντάκτη, δεν προχωρούμε
	# σε εκτύπωση των στοιχείων του καθώς αυτά έχουν ήδη εκτυπωθεί.

	if (sincount[sintaktis] > 1)
	return

	query = "SELECT `tilefono` " \
		"FROM `erpota`.`prosvasi` " \
		"WHERE `ipalilos` = " sintaktis
	spawk_submit(query)

	while (spawk_fetchrow(prosvasi)) {
		if (!prosvasi[1])
		print_sintaktis(sintaktis, deltio)
	}
}

# Η function "print_sintaktis" καλείται για τυς συντάκτες που δεν έχουν
# καταχωρημένο τηλέφωνο επικοινωνίας, και δέχεται ως παραμέτρους ένα record
# δελτίου και των κωδικό του συντάκτη, με σκοπό να εκτυπώσει τα στοιχεία τού
# δελτίου και του συντάκτη ώστε να τον αναζητήσουμε και να καταχωρήσουμε
# κάποιο τηλέφωνο επικοινωνίας.

function print_sintaktis(sintaktis, deltio,		perigrafi, \
	die, tmi, query, ipalilos) {

	perigrafi = deltio["perigrafi"]
	die = ipiresia[substr(deltio["ipiresia"], 0, 3)]
	tmi = ipiresia[substr(deltio["ipiresia"], 0, 7)]

	query = "SELECT `kodikos`, `eponimo`, `onoma`, `patronimo` " \
		"FROM `erpota1`.`ipalilos` " \
		"WHERE `kodikos` = " sintaktis
	spawk_submit(query)

	while (spawk_fetchrow(ipalilos, 0)) {
		print ipalilos[0]
		print deltio["ipiresia"], perigrafi

		if (die != perigrafi)
		print die

		if (tmi && (tmi != die) && (tmi != perigrafi))
		print tmi

		print ""
	}
}

# Η function "select_ipiresia" καλείται μία φορά στην αρχή του προγράμματος.
# Η function σαρώνει τον πίνακα υπηρεσιών δημιουργώντας global λίστα υπηρεσιών
# δεικτοδοτημένη με τον κωδικό υπηρεσίας.

function select_ipiresia(			query, row) {
	query = "SELECT `kodikos`, `perigrafi` FROM `erpota1`.`ipiresia`"
	spawk_submit(query)

	while (spawk_fetchrow(row))
	ipiresia[row[1]] = row[2]
}
