#!/usr/local/bin/awk -f

@include "/var/opt/pandora/lib/pandora.awk"
@include "/var/opt/kartel/lib/karteldb.awk"

BEGIN {
	FS = "\t"
	OFS = "\t"

	deltio_create = "awk -v verbose=0 " \
		"-v creator=3307 " \
		"-v imerominia=2020-02-26 " \
		"-f /var/opt/letrak/lib/deltio.awk"
	select_ipiresia()
	create_deltio("ΠΡΟΣΕΛΕΥΣΗ")
	create_deltio("ΑΠΟΧΩΡΗΣΗ")
	update_prosvasi()
	exit(0)
}

function select_ipiresia(		query, row) {
	query = "SELECT `kodikos`, `perigrafi`" \
		" FROM " kartel_erpotadb("ipiresia")

	if (spawk_submit(query, 1) != 3)
	pd_fatal("Αποτυχία σαρώματος υπηρεσιών")

	while (spawk_fetchrow(row)) {
		if (row[1] ~ /^[ΑΒΓΔΕ][0-9][0-9]..../)
		ipiresia[row[1]] = row[2]
	}
}

function create_deltio(prosapo,		i) {
	for (i in ipiresia)
	print i, ipiresia[i], prosapo | deltio_create
}

# Μετατρέπουμε το password πρόσβασης σε "xxx" για όλους.

function update_prosvasi(		query) {
	query = "REPLACE INTO `erpota`.`prosvasi` (`ipalilos`, `efarmogi`, " \
		"`ipiresia`, `level`, `info`, `pubkey`, `password`) VALUES (" \
		"5837, '2020-01-01', 'Β09', 'VIEW', '', 'abc', '')"
	spawk_submit(query)

	query = "UPDATE `erpota`.`prosvasi` " \
		"SET `password` = 'b60d121b438a380c343d5ec3c2037564b82ffef3'"
	spawk_submit(query)
}
