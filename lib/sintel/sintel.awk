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

	select_deltio()

	exit(0)
}

function select_deltio(				query, deltio) {
	query = "SELECT `kodikos`, `imerominia` FROM `letrak`.`deltio` " \
		"WHERE `imerominia` > DATE_SUB(NOW(), INTERVAL 35 DAY)"
print query
	spawk_submit(query)

	while (spawk_fetchrow(row))
	print row[1], row[2]

	exit(0)
}
