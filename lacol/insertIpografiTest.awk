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

	for (imerisio = 1; imerisio < 10; imerisio++)
	add_ipografes(imerisio)
}

function add_ipografes(imerisio,		i) {
	for (i = 1; i <= nipo; i++)
	spawk_submit("INSERT INTO `letrak`.`ipografi` " \
		"(`imerisio`, `taxinomisi`, `armodios`) VALUES " \
		"(" imerisio ", " i ", " ipografi[i] ")")
}
