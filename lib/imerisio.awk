@load "spawk"

BEGIN {
	spawk_sesami["dbuser"] = "admin"
	spawk_sesami["dbpassword"] = spawk_getpass()

	read_ipiresia()
	read_ipalilos()

	query = "SELECT `kodikos`, `imerominia`, `perigrafi`, " \
		"`ipiresia`, `prosapo` " \
		"FROM `letrak`.`deltio` WHERE (1 = 1)"

	if (apo)
	where_and("`imerominia` >= " spawk_escape(apo))

	if (eos)
	where_and("`imerominia` <= " spawk_escape(eos))

	if (ipmask)
	process_ipiresia(ipmask)

	query = query " ORDER BY `ipiresia`, `imerominia`, `prosapo` ASC, `kodikos`"

	spawk_submit(query)

	while (spawk_fetchrow(deltio))
	process_deltio(deltio)

	exit(0)
}

function process_deltio(deltio,			query, row, parousia, adia, plist, i, n) {
	epikefalida(deltio)

	query = "SELECT `ipalilos`, `orario`, `karta`, `adidos`, `excuse`, " \
		"`adapo`, `adeos`, `info` " \
		"FROM `letrak`.`parousia` " \
		"WHERE `deltio` = " deltio[1]
	spawk_submit(query)

	i = 0

	while (spawk_fetchrow(row)) {
		parousia = ipalilos[row[1]] " [" row[1] "]"
		if (row[5])
		adia = row[5]

		else if (row[4])
		adia = sprintf("%s %10s-%10s", row[4], row[6], row[7])

		if (adia)
		parousia = parousia " " adia

		if (row[8])
		parousia = parousia " " row[8]

		plist[i++] = parousia
	}

	n = asort(plist)

	for (i = 1; i <= n; i++)
	print "\t" plist[i]
}

function epikefalida(deltio,		monada) {
	epikefalida_item("Κωδικός", deltio[1])
	epikefalida_item("Ημερομηνία", deltio[2] " >>" deltio[5] "<<")
	epikefalida_item("Περιγραφή", deltio[3])

	print_ipiresia("Διεύθυνση", substr(deltio[4], 0, 3))
	print_ipiresia("Τμήμα", substr(deltio[4], 0, 7))
}

function print_ipiresia(monada, kodikos) {
	epikefalida_item(monada, sprintf("[ %-7s ] %s", kodikos, ipiresia[kodikos]))
}

function epikefalida_item(key, val) {
	printf("%10s: %s\n", key, val);
}

function where_and(s) {
	query = query " AND (" s ")"
}

function process_ipiresia(ipmask,		n, a) {
	query = query " AND ((1 <> 1)"

	n = split(ipmask, a, ",")

	while (n > 1) {
		query = query " OR (`ipiresia` LIKE " spawk_escape(a[n]) ")"
		n--
	}

	query = query ")"
}

function read_ipiresia(			query, row) {
	query = "SELECT `kodikos`, `perigrafi` " \
		"FROM `erpota1`.`ipiresia`"

	spawk_submit(query)

	while (spawk_fetchrow(row))
	ipiresia[row[1]] = row[2]
}

function read_ipalilos(			query, row) {
	query = "SELECT `kodikos`, `eponimo`, `onoma`, `patronimo` " \
		"FROM `erpota1`.`ipalilos`"

	spawk_submit(query)

	while (spawk_fetchrow(row))
	ipalilos[row[1]] = row[2] " " row[3] " " substr(row[4], 0, 3)
}
