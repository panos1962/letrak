#!/usr/bin/env gawk

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
# lib/prosvasi.awk —— AWK script προγράμματος ενημέρωσης στοιχείων πρόσβασης
# χρήστη για kartel/letrak
# @FILE END
#
# @DESCRIPTION BEGIN
#
# Το παρόν AWK script αποτελεί το engine του προγράμματος "prosvasi" το
# οποίο ενημερώενει τα στοιχεία πρόσβασης των υπαλλήλων στα προγράμματα
# kartel/letrak.
#
# Κάθε γραμμή του input αφορά σε έναν υπάλληλο και πρέπει να έχει ως πρώτο
# πεδίο τον κωδικό υπαλλήλου, ενώ τα τελευταία τρία πεδία είναι ο κωδικός
# υπηρεσίας (@ για null, * για όλες τις υπηρεσίες), το επίπεδο πρόσβασης
# (VIEW, UPDATE, ADMIN ή @ για null) και το password.
#
# @DESCRIPTION END
#
# @HISTORY BEGIN
# Created: 2022-03-16
# @HISTORY END
#
# @END

@load "spawk.so"

BEGIN {
	access["VIEW"] = "VIEW"
	access["V"] = "VIEW"
	access["UPDATE"] = "UPDATE"
	access["U"] = "UPDATE"
	access["ADMIN"] = "ADMIN"
	access["A"] = "ADMIN"

	errip = "?"
}

NF < 1 {
	next
}

{
	process_ipalilos()
}

function process_ipalilos(		query, ipalilos, \
	ip, ipiresia, vua, cmd, pass) {
	query = "SELECT `kodikos`, `eponimo`, `onoma`, `patronimo` " \
		"FROM " kartel_erpotadb("ipalilos") " " \
		"WHERE `kodikos` = " ($1 + 0)

	if (spawk_submit(query, "ASSOC") != 3)
	return errmsg($1 ": λανθασμένος κωδικός υπαλλήλου")

	if (!spawk_fetchone(ipalilos))
	return errmsg($1 ": δεν βρέθηκε ο υπάλληλος")

	print "[ " ipalilos["kodikos"] " ] " ipalilos["eponimo"] " " \
		ipalilos["onoma"] " " ipalilos["patronimo"]

	if (NF < 4)
	return errmsg($0 ": syntax error")

	if ((ip = parse_ipiresia()) == errip)
	return

	vua = $(NF - 1)

	if (!(vua in access))
	return errmsg($0 ": " vua ": λανθασμένη πρόσβαση")

	vua = access[vua]

	print "[ " vua " ]"

	cmd = "echo -n " $NF " | sha1sum"
	cmd | getline
	pass = $1

	print "[ " pass " ]"

	if (!enimerosi)
	return

	query = "UPDATE `erpota`.`prosvasi` SET " \
		"`ipiresia` = " ip ", " \
		"`level` = " spawk_escape(vua) ", " \
		"`password` = " spawk_escape(pass) " " \
		"WHERE `ipalilos` = " ipalilos["kodikos"]

	if (spawk_submit(query) != 2)
	return errmsg($0 ": update failed")
}

function parse_ipiresia(			ip, query, ipiresia) {
	ip = $(NF - 2)

	if (ip == "@") {
		print "[ μόνο στα προσωπικά του στοιχεία ]"
		return "NULL"
	}

	if (ip == "*") {
		print "[ σε όλες τις υπηρεσίες ]"
		return spawk_escape("")
	}

	query = "SELECT `kodikos`, `perigrafi` " \
		"FROM " kartel_erpotadb("ipiresia") " " \
		"WHERE `kodikos` = " spawk_escape(ip)

	if (spawk_submit(query, "ASSOC") != 3) {
		errmsg($0 ": " ip ": λανθασμένος κωδικός υπηρεσίας")
		return errip
	}

	if (!spawk_fetchone(ipiresia)) {
		errmsg($0 ": " ip ": δεν βρέθηκε η υπηρεσία")
		return errip
	}

	print "[ " ipiresia["kodikos"] " ] " ipiresia["perigrafi"]
	return spawk_escape(ipiresia["kodikos"])
}

function errmsg(msg) {
	print msg >"/dev/stderr"
}
