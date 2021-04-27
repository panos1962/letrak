BEGIN {
	FS = "\t"
	OFS = "\t"

	spawk_verbose = 0
	spawk_null = ""
}

NF != 5 {
	pd_errmsg($0 ": syntax error")
	print NF
}

{
	nf = 1
	ipiresia = $(nf++)
	onomateponimo = $(nf++)
	ipalilos = $(nf++)
	imerominia = pd_dt2dt($(nf++), "YMD", "D‐M‐Y")
	adia = $(nf++)

	if (ipiresia != ipiresia_prev)
	process_ipiresia()

	print ipiresia, die, tmi, ipalilos, onomateponimo, imerominia, adia
}

function process_ipiresia(				d, t, query, x) {
	ipiresia_prev = ipiresia
	die = ""
	tmi = ""

	if (ipiresia == "")
	return

	d = substr(ipiresia, 1, 3)
	query = "SELECT `perigrafi` FROM `erpota1`.`ipiresia` " \
		"WHERE `kodikos` = " spawk_escape(d)

	if (spawk_submit(query) != 3)
	return pd_errmsg($0 ": SQL error")

	if (spawk_fetchone(x))
	die = x[1]

	t = substr(ipiresia, 1, 7)

	if (t == d)
	return

	query = "SELECT `perigrafi` FROM `erpota1`.`ipiresia` " \
		"WHERE `kodikos` = " spawk_escape(t)

	if (spawk_submit(query) != 3)
	return pd_errmsg($0 ": SQL error")

	if (spawk_fetchone(x))
	tmi = x[1]
}
