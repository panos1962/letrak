BEGIN {
	FS = "\t"
	OFS = "\t"

	spawk_verbose = 0
	spawk_null = ""
}

NF != 4 {
	pd_errmsg($0 ": syntax error")
	print NF
}

{
	nf = 1
	onomateponimo = $(nf++)
	ipalilos = $(nf++)
	imerominia = pd_dt2dt($(nf++), "YMD", "D‐M‐Y")
	adia = $(nf++)

	print ipalilos, onomateponimo, imera(imerominia), imerominia, adia
}

function imera(imerominia,				a, t) {
	if (split(imerominia, a, /[^0-9]/) != 3)
	return ""

	t = mktime(sprintf("%04d %02d %02d 00 00 00", a[3], a[2], a[1]))

	if (t < 0)
	return ""

	return strftime("%A", t)
}
