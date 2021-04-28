BEGIN {
	OFS = "\t"

	spawk_verbose = 0
	spawk_null = ""
}

NF < 1 {
	next
}

$1 !~ /^[0-9]{1,8}$/ {
	pd_errmsg($0 ": λανθασμένος κωδικός δελτίου")
	next
}

{
	process_deltio($1)
}

function process_deltio(kodikos,			query, deltio) {
	query = "SELECT `kodikos`, `imerominia`, `ipiresia`, " \
		"`perigrafi`, `prosapo` " \
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
	adia = "?????????"

	print \
	ipalilos_onoma(parousia["ipalilos"]), \
	parousia["ipalilos"], \
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
