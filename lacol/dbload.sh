#!/usr/bin/env awk -f

@include "/var/opt/pandora/lib/pandora.awk"
@include "/var/opt/kartel/lib/karteldb.awk"

BEGIN {
	FS = "\t"
	OFS = "\t"

	deltio_create = "awk -v creator=3307 " \
		"-f /var/opt/letrak/lib/deltio.awk"
	select_ipiresia()
	create_deltio("ΠΡΟΣΕΛΕΥΣΗ")
	create_deltio("ΑΠΟΧΩΡΗΣΗ")
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
	
