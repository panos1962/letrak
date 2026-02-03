@load "spawk"

BEGIN {
	if (dbuser)
	spawk_sesami["dbuser"] = dbuser

	else
	spawk_sesami["dbuser"] = "admin"

	if (dbpass)
	spawk_sesami["dbpassword"] = spawk_getpass()

	spawk_null = ""

	read_ipiresia()
	read_ipalilos()
	diaxoristiko()

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

	print "\nΠαρουσίες"
	diaxoristiko1(9)

	query = "SELECT `ipalilos`, `orario`, `karta`, `adidos`, `excuse`, " \
		"`adapo`, `adeos`, `info`, `meraora` " \
		"FROM `letrak`.`parousia` " \
		"WHERE `deltio` = " deltio[1]
	spawk_submit(query)

	i = 0

	while (spawk_fetchrow(row)) {
		parousia = sprintf("%-40.40s %10.10s", ipalilos[row[1]], row[2])

		if (row[5])
		adia = row[5]

		else if (row[4])
		adia = sprintf("%s από %10s έως %10s", row[4], row[6], row[7])

		else
		adia = ""

		if (adia)
		parousia = parousia " " adia

		else
		parousia = parousia " " substr(row[9], 12, 5)

		if (row[8])
		parousia = parousia " " row[8]

		plist[i++] = parousia
	}

	n = asort(plist)

	for (i = 1; i <= n; i++)
	printf("%3d. %s\n", i, plist[i])

	diaxoristiko2(120)
}

function epikefalida(deltio,		monada) {
	print "\nΣτοιχεία δελτίου προσέλευσης/αποχώρησης"
	diaxoristiko1(39)

	epikefalida_item("Κωδικός", deltio[1])
	epikefalida_item("Ημερομηνία", deltio[2])
	epikefalida_item("Είδος", deltio[5])

	print_ipiresia("Διεύθυνση", substr(deltio[4], 0, 3))
	print_ipiresia("Τμήμα", substr(deltio[4], 0, 7))

	if (deltio[3] != ipiresia[deltio[4]])
	epikefalida_item("Περιγραφή", deltio[3])

	ipografes(deltio[1])
}

function print_ipiresia(monada, kodikos) {
	epikefalida_item(monada, sprintf("[ %-7s ] %s", kodikos, ipiresia[kodikos]))
}

function epikefalida_item(key, val) {
	printf("%-10s: %s\n", key, val);
}

function ipografes(deltio,		query, row, i) {
	print "\nΥπογράφοντες"
	diaxoristiko1(12)

	query = "SELECT `armodios`, `titlos`, `checkok`, `taxinomisi`" \
		" FROM `letrak`.`ipografi` WHERE `deltio` = " deltio \
		" ORDER BY `taxinomisi`"
	spawk_submit(query)

	for (i = 1; spawk_fetchrow(row); i++) {
		if (!row[2])
		row[2] = "Συντάκτης/Συντάκτρια"
		printf("%3d. %-40.40s %s (%s)\n", i, ipalilos[row[1]], row[2], row[3])
	}
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
	ipalilos[row[1]] = row[2] " " row[3] " " substr(row[4], 0, 3) \
		" [ " row[1] " ]"
}

function diaxoristiko(				i) {
	grami1 = ""
	grami2 = ""

	for (i = 500; i > 0; i--) {
		grami1 = grami1 "-"
		grami2 = grami2 "="
	}
}

function diaxoristiko1(len) {
	print substr(grami1, 0, len)
}

function diaxoristiko2(len) {
	print substr(grami2, 0, len)
}
