@load "spawk"

BEGIN {
	spawk_sesami["dbuser"] = "admin"
	spawk_sesami["dbpassword"] = spawk_getpass()

	read_ipalilos()

	query = "SELECT `kodikos`, `ipiresia`, `imerominia` " \
		"FROM `letrak`.`deltio` WHERE (1 = 1)"

	if (apo)
	where_and("`imerominia` >= " spawk_escape(apo))

	if (eos)
	where_and("`imerominia` <= " spawk_escape(eos))

	if (ipiresia)
	process_ipiresia(ipiresia)

	query = query " ORDER BY `ipiresia`, `imerominia`, `kodikos`"

	spawk_submit(query)

	while (spawk_fetchrow(deltio))
	process_deltio(deltio)

	exit(0)
}

function process_deltio(deltio,			query, parousia, plist, i, n) {
	print deltio[1], deltio[2], deltio[3]

	query = "SELECT `ipalilos` FROM `letrak`.`parousia` " \
		"WHERE `deltio` = " deltio[1]
	spawk_submit(query)

	i = 0

	while (spawk_fetchrow(parousia))
	plist[i++] = onoma[parousia[1]] " [" parousia[1] "]"

	n = asort(plist)

	for (i = 1; i <= n; i++)
	print "\t" plist[i]
}

function where_and(s) {
	query = query " AND (" s ")"
}

function process_ipiresia(ipiresia,		n, a) {
	query = query " AND ((1 <> 1)"

	n = split(ipiresia, a, ",")

	while (n > 1) {
		query = query " OR (`ipiresia` LIKE " spawk_escape(a[n]) ")"
		n--
	}

	query = query ")"
}

function read_ipalilos(			query, ipalilos) {
	query = "SELECT `kodikos`, `eponimo`, `onoma`, `patronimo` " \
		"FROM `erpota1`.`ipalilos`"

	spawk_submit(query)

	while (spawk_fetchrow(ipalilos))
	onoma[ipalilos[1]] = ipalilos[2] " " ipalilos[3] " " substr(ipalilos[4], 0, 3)
}
