BEGIN {
	OFS = "\t"

	orio += 0

	minas = sprintf("%02d", yyyymm % 100)
	etos = sprintf("%04d", (yyyymm - minas) / 100)

	query = "SELECT `kodikos`, `imerominia`, `prosapo`" \
		" FROM `deltio`" \
		" WHERE `ipiresia` LIKE " spawk_escape(ipiresia) \
		" AND `imerominia` BETWEEN '" etos "-01-01' AND '" etos "-12-31'" \
		" ORDER BY `imerominia`, `kodikos`"

	if (spawk_submit(query, "ASSOC") != 3)
	fatal(query ": SQL error")

	while (spawk_fetchrow(deltio)) {
		split(deltio["imerominia"], a, /[^0-9]/)

		if (a[2] == minas)
		process_deltio(deltio)
	}

	for (i in total_ores)
	print ipalilos(i), total_ores[i] " ώρες", total_lepta[i] " λεπτά"
}

function process_deltio(deltio,				query, parousia) {
	query = "SELECT `ipalilos`, `orario`, `adidos`, `meraora`" \
		" FROM `parousia`" \
		" WHERE `deltio` = " deltio["kodikos"]

	if (spawk_submit(query, "ASSOC") != 3)
	fatal(query ": SQL failed")

	while (spawk_fetchrow(parousia, ""))
	process_parousia(deltio, parousia)
}

function process_parousia(deltio, parousia,			orario, \
	meraora, diafora) {

	if (split(parousia["orario"], orario, "-") != 2)
	return error(deltio["imerominia"] "@" parousia[""] ": λανθασμένο ωράριο")

	meraora = substr(parousia["meraora"], 0, 11)

	diafora = 0

	if ((deltio["prosapo"] == "ΠΡΟΣΕΛΕΥΣΗ") && proselefsi)
	diafora = diafora_calc(parousia["ipalilos"], parousia["meraora"], meraora orario[1])

	if ((deltio["prosapo"] == "ΑΠΟΧΩΡΗΣΗ") && apoxorisi)
	diafora = diafora_calc(parousia["ipalilos"], meraora orario[2], parousia["meraora"])

	if (!diafora)
	return

	print deltio["imerominia"], deltio["prosapo"], \
		ipalilos(parousia["ipalilos"]), parousia["adidos"], diafora
}

function diafora_calc(ipalilos, meraora1, meraora2,		query, diafora, a, m) {
	query = "SELECT TIMEDIFF('" meraora2 "', '" meraora1 "')"

	if (spawk_submit(query) != 3)
	fatal(query ": SQL failed")

	spawk_fetchone(diafora)

	split(diafora[1], a, ":")
	m = (a[1] * 60) + a[2]

	if (m < orio)
	return 0

	total_ores[ipalilos] += a[1]
	total_lepta[ipalilos] += a[2]

	return substr(diafora[1], 0, 5)
}

function ipalilos(kodikos,			query, row) {
	if (kodikos in ipalilos_list)
	return ipalilos_list[kodikos]

	query = "SELECT `eponimo`, `onoma`, `patronimo`" \
		" FROM `erpota1`.`ipalilos` WHERE `kodikos` = " kodikos

	if (spawk_submit(query) != 3)
	fatal(query ": SQL failed")

	if (spawk_fetchone(row))
	return ipalilos_list[kodikos] = row[1] " " row[2] " " \
		substr(row[3], 0, 3) " [ " kodikos " ]"

	return (ipalilos_list[kodikos] = "ΑΓΝΩΣΤΟΣ [ " kodikos " ]")
}
