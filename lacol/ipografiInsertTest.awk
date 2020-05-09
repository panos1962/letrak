#!/usr/bin/env awk -f

@include "/var/opt/pandora/lib/pandora.awk"
@include "/var/opt/kartel/lib/karteldb.awk"

BEGIN {
	FS = "\t"
	spawk_verbose = 0

	nipo = 1
	ipografi[nipo++] = 3307
	ipografi[nipo++] = 2922
	ipografi[nipo++] = 3642
	ipografi[nipo++] = 5837

	for (deltio = 1; deltio < 10; deltio++)
	add_ipografes(deltio)
}

function add_ipografes(deltio,		i) {
	for (i = 1; i <= nipo; i++)
	spawk_submit("INSERT INTO `letrak`.`ipografi` " \
		"(`deltio`, `taxinomisi`, `armodios`) VALUES " \
		"(" deltio ", " i ", " ipografi[i] ")")
}
