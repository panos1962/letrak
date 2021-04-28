BEGIN {
	FS = "\t"
	OFS = "\t"

	spawk_verbose = 0
	spawk_null = ""

	dow[1] = "ΔΕΥΤΕΡΑ"
	dow[2] = "ΤΡΙΤΗ"
	dow[3] = "ΤΕΤΑΡΤΗ"
	dow[4] = "ΠΕΜΠΤΗ"
	dow[5] = "ΠΑΡΑΣΚΕΥΗ"
	dow[6] = "ΣΑΒΒΑΤΟ"
	dow[7] = "ΚΥΡΙΑΚΗ"
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

	if (full)
	printf die OFS tmi OFS

	print ipiresia, ipalilos, onomateponimo, imerominia, \
		imera(imerominia), adia
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

function imera(imerominia,				a, t) {
	if (split(imerominia, a, /[^0-9]/) != 3)
	return ""

	t = mktime(sprintf("%04d %02d %02d 00 00 00", a[3], a[2], a[1]))

	if (t < 0)
	return ""

	return dow[strftime("%u", t)]
}
