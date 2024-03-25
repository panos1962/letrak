BEGIN {
	FS = "\t"
	OFS = "\t"
}

{
	proc = "proc_" $1
	@proc()
}

function proc_ipiresia(			ipiresia) {
	ipiresia = $2
	ipiresia_perigrafi[ipiresia] = $3
}

function proc_ipalilos(			ipalilos) {
	ipalilos = $2 + 0
	ipalilos_eponimo[ipalilos] = $3
	ipalilos_onoma[ipalilos] = $4
	ipalilos_patronimo[ipalilos] = $5
}

function proc_deltio(			deltio) {
	deltio = $2 + 0
	deltio_ipiresia[deltio] = $3
	deltio_perigrafi[deltio] = $4
}

function proc_parousia(			ipalilos, deltio, karta) {
	ipalilos = $2 + 0
	deltio = $3 + 0
	karta = $4 + 0

	ipalilos_ipiresia[ipalilos] = deltio_ipiresia[deltio]
	ipalilos_monada[ipalilos] = deltio_perigrafi[deltio]
	karta_ipalilos[karta] = ipalilos
}

function ipalilos_data(ipalilos) {
	return ipalilos_eponimo[ipalilos] " " \
		ipalilos_onoma[ipalilos] " " \
		substr(ipalilos_patronimo[ipalilos], 0, 3)
}

function proc_event(			id, meraora, karta, reader,
	ipalilos, ipiresia, monada, diefthinsi) {

	id = $2 + 0
	meraora = $3
	karta = $4 + 0
	reader = $5

	ipalilos = karta_ipalilos[karta]

	if (!ipalilos) {
		print $0 ": ακαθόριστος υπάλληλος" >"/dev/stderr"
		return
	}

	ipiresia = ipalilos_ipiresia[ipalilos]
	monada = ipalilos_monada[ipalilos]
	diefthinsi = ipiresia_perigrafi[substr(ipiresia, 0, 3)]

	if (count) {
		count_monada[monada]++
		count_dieftinsi++
	}

	else {
		print ipiresia, diefthinsi, monada, ipalilos, \
			ipalilos_data(ipalilos), \
			"[ " substr(meraora, 12, 8) " ]"
	}
}

END {
	if (!count)
	exit(0)

	sort="sort -t '	'"

	for (monada in count_monada) {
		diefthinsi = ipiresia_perigrafi[substr(monada, 0, 3)]
		print monada, diefthnisi, count_monada[i] | sort
	}
}
