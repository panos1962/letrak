#!/usr/bin/env gawk

@load "spawk.so"
@include "pandora.awk"
@include "karteldb.awk"

BEGIN {
	access["VIEW"] = "VIEW"
	access["V"] = "VIEW"
	access["UPDATE"] = "UPDATE"
	access["U"] = "UPDATE"
}

NF < 1 {
	next
}

{
	process_ipalilos()
}

function process_ipalilos(		query, ipalilos, \
	ip, ipiresia, vu, cmd, pass) {
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

	ip = $(NF - 2)
	query = "SELECT `kodikos`, `perigrafi` " \
		"FROM " kartel_erpotadb("ipiresia") " " \
		"WHERE `kodikos` = " spawk_escape(ip)

	if (spawk_submit(query, "ASSOC") != 3)
	return errmsg($0 ": " ip ": λανθασμένος κωδικός υπηρεσίας")

	if (!spawk_fetchone(ipiresia))
	return errmsg($0 ": " ip ": δεν βρέθηκε η υπηρεσία")

	print "[ " ipiresia["kodikos"] " ] " ipiresia["perigrafi"]

	vu = $(NF - 1)

	if (!(vu in access))
	return errmsg($0 ": " vu ": λανθασμένη πρόσβαση")

	vu = access[vu]

	print "[ " vu " ]"

	cmd = "echo -n " $NF " | sha1sum"
	cmd | getline
	pass = $1

	print "[ " pass " ]"

	if (!enimerosi)
	return

	query = "UPDATE `erpota`.`prosvasi` SET " \
		"`ipiresia` = " spawk_escape(ipiresia["kodikos"]) ", " \
		"`level` = " spawk_escape(vu) ", " \
		"`password` = " spawk_escape(pass) " " \
		"WHERE `ipalilos` = " ipalilos["kodikos"]

	if (spawk_submit(query) != 2)
	return errmsg($0 ": update failed")
}

function errmsg(msg) {
	print msg >"/dev/stderr"
}
