BEGIN {
	FS = "\t"
	OFS = "\t"
}

{
	$2 += 0
	$3 += 0
	$4 += 0

	if ($2 != ipalilos)
	print_ipalilos()

	ipalilos = $2
	deltio = $3
	karta = $4
}

END {
	print_ipalilos()
}

function print_ipalilos() {
	if (!ipalilos)
	return

	print $1, ipalilos, deltio, karta
}
