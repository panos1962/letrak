@load "spawk"

BEGIN {
	if (dbuser)
	spawk_sesami["dbuser"] = dbuser

	else
	spawk_sesami["dbuser"] = "admin"

	if (dbpass)
	spawk_sesami["dbpassword"] = spawk_getpass()

	spawk_sesami["dbcharset"] = "utf8"
	spawk_null = ""

	onomateponimo_width = 40

	read_ipiresia()
	read_ipalilos()
	grami_init()

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

function process_deltio(deltio,			query, row, parousia, adia, i) {
	epikefalida(deltio)

	enotita("Παρουσίες")

	query = "SELECT" \
		" `letrak`.`parousia`.`ipalilos`," \
		" `letrak`.`parousia`.`orario`," \
		" `letrak`.`parousia`.`karta`," \
		" `letrak`.`parousia`.`adidos`," \
		" `letrak`.`parousia`.`excuse`," \
		" `letrak`.`parousia`.`adapo`," \
		" `letrak`.`parousia`.`adeos`," \
		" `letrak`.`parousia`.`info`," \
		" `letrak`.`parousia`.`meraora`," \
		" `erpota1`.`ipalilos`.`eponimo`," \
		" `erpota1`.`ipalilos`.`onoma`," \
		" `erpota1`.`ipalilos`.`patronimo`" \
		" FROM" \
		" `letrak`.`parousia`" \
		" INNER JOIN `erpota1`.`ipalilos` ON" \
		" `letrak`.`parousia`.`ipalilos` = `erpota1`.`ipalilos`.`kodikos`" \
		" WHERE `deltio` = " deltio[1] \
		" ORDER BY" \
		" `erpota1`.`ipalilos`.`eponimo`," \
		" `erpota1`.`ipalilos`.`onoma`," \
		" `erpota1`.`ipalilos`.`patronimo`," \
		" `letrak`.`parousia`.`ipalilos`"
	spawk_submit(query)

	for (i = 1; spawk_fetchrow(row); i++) {
		parousia = sprintf("%-*.*s %10.10s", \
			onomateponimo_width, onomateponimo_width, \
			ipalilos[row[1]], row[2])

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

		printf("%3d. %s\n", i, parousia)
	}

	diaxoristiko(120)
}

function epikefalida(deltio,		monada) {
	enotita("Στοιχεία δελτίου προσέλευσης/αποχώρησης")

	epikefalida_item("Κωδικός", deltio[1])
	epikefalida_item("Ημερομηνία", deltio[2])
	epikefalida_item("Είδος", deltio[5])

	print_ipiresia("Διεύθυνση", substr(deltio[4], 1, 3))
	print_ipiresia("Τμήμα", substr(deltio[4], 1, 7))

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
	enotita("Υπογράφοντες")

	query = "SELECT `armodios`, `titlos`, `checkok`, `taxinomisi`" \
		" FROM `letrak`.`ipografi` WHERE `deltio` = " deltio \
		" ORDER BY `taxinomisi`"
	spawk_submit(query)

	for (i = 1; spawk_fetchrow(row); i++) {
		if (!row[2])
		row[2] = "Συντάκτης/Συντάκτρια"

		if (!row[3])
		row[3] = "*** ΑΝΥΠΟΓΡΑΦΟ ***"

		printf("%3d. %-*.*s %s (%s)\n", \
			i, onomateponimo_width, onomateponimo_width, \
			ipalilos[row[1]], row[2], row[3])
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

function read_ipalilos(			query, row, \
	onomateponimo, kodikos, s, l1, l2) {

	query = "SELECT `kodikos`, `eponimo`, `onoma`, `patronimo` " \
		"FROM `erpota1`.`ipalilos`"

	spawk_submit(query)

	while (spawk_fetchrow(row)) {
		onomateponimo = row[2] " " row[3] " " substr(row[4], 1, 3)
		kodikos = " [" row[1] "]"

		s = onomateponimo kodikos
		l1 = onomateponimo_width - length(s)

		if (l1 < 0) {
			l2 = length(onomateponimo)
			s = substr(onomateponimo, 1, l2 + l1) kodikos
		}

		ipalilos[row[1]] = s
	}
}

function grami_init(				i) {
	grami1 = ""
	grami2 = ""

	for (i = 500; i > 0; i--) {
		grami1 = grami1 "-"
		grami2 = grami2 "="
	}
}

function enotita(s, len) {
	if (s)
	print "\n" s

	print substr(grami1, 1, length(s))
}

function diaxoristiko(len) {
	print substr(grami2, 1, len)
}
