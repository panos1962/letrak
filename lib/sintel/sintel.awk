@load "spawk"

BEGIN {
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
		print progname ": " sesamidb ": cannot read file" >"/dev/stderr"
		exit(1)
	}

	spawk_sesami["charset"] = "utf8"

	select_ipiresia()
	select_deltio()

	exit(0)
}

function select_deltio(				query, deltio) {
	query = "SELECT `kodikos`, `imerominia`, `perigrafi`, `ipiresia` " \
		"FROM `letrak`.`deltio` " \
		"WHERE `imerominia` > DATE_SUB(NOW(), INTERVAL 35 DAY)"
	spawk_submit(query, "ASSOC")

	while (spawk_fetchrow(deltio))
	process_deltio(deltio)
}

function process_deltio(deltio,			query, sintaktis) {
	query = "SELECT `armodios` " \
		"FROM `letrak`.`ipografi` " \
		"WHERE (`deltio` = " deltio["kodikos"] ") " \
		"AND (`taxinomisi` = 1)"
	spawk_submit(query)

	while (spawk_fetchrow(sintaktis))
	process_sintaktis(deltio, sintaktis[1])
}

function process_sintaktis(deltio, sintaktis,		query, prosvasi) {
	query = "SELECT `tilefono` " \
		"FROM `erpota`.`prosvasi` " \
		"WHERE `ipalilos` = " sintaktis
	spawk_submit(query)

	while (spawk_fetchrow(prosvasi)) {
		if (prosvasi[1])
		continue

		print_sintaktis(deltio, sintaktis)
	}
}

function print_sintaktis(deltio, sintaktis,		die, tmi, query, ipalilos) {
	die = ipiresia[substr(deltio["ipiresia"], 0, 3)]
	tmi = ipiresia[substr(deltio["ipiresia"], 0, 7)]

	query = "SELECT `kodikos`, `eponimo`, `onoma`, `patronimo` " \
		"FROM `erpota1`.`ipalilos` " \
		"WHERE `kodikos` = " sintaktis
	spawk_submit(query)

	while (spawk_fetchrow(ipalilos, 0)) {
		print ipalilos[0]
		print deltio["perigrafi"]

		if (die)
		print die

		if ((tmi != die) && (tmi != deltio["perigrafi"]))
		print tmi

		print ""
	}
}

function select_ipiresia(			query, row) {
	query = "SELECT `kodikos`, `perigrafi` FROM `erpota1`.`ipiresia`"
	spawk_submit(query)

	while (spawk_fetchrow(row))
	ipiresia[row[1]] = row[2]
}
