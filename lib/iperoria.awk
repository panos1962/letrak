BEGIN {
	OFS = "\t"
	spawk_null = ""

	orio += 0

	minas = sprintf("%02d", yyyymm % 100)
	etos = sprintf("%04d", (yyyymm - minas) / 100)

	query = "SELECT `kodikos`, `imerominia`, `prosapo`" \
		" FROM `deltio`" \
		" WHERE `ipiresia` LIKE " spawk_escape(ipiresia) \
		" AND `imerominia` BETWEEN '" etos "-01-01' AND '" etos "-12-31'"

	if (proselefsi && (!apoxorisi))
	query = query " AND `prosapo` = 'ΠΡΟΣΕΛΕΥΣΗ'"

	else if (apoxorisi && (!proselefsi))
	query = query " AND `prosapo` = 'ΑΠΟΧΩΡΗΣΗ'"

	query = query " ORDER BY `imerominia`, `kodikos`"

	if (spawk_submit(query, "ASSOC") != 3)
	fatal(query ": SQL error")

	while (spawk_fetchrow(deltio)) {
		split(deltio["imerominia"], a, /[^0-9]/)

		if (a[2] == minas)
		process_deltio(deltio)
	}

	for (i in total_ores)
	printf "%66.66s %7d ώρες %4d λεπτά\n", ipalilos(i), total_ores[i], total_lepta[i]
}

function process_deltio(deltio,				query, parousia) {
	query = "SELECT `ipalilos`, `orario`, `adidos`, `excuse`, `meraora`" \
		" FROM `parousia`" \
		" WHERE `deltio` = " deltio["kodikos"]

	if (spawk_submit(query, "ASSOC") != 3)
	fatal(query ": SQL failed")

	while (spawk_fetchrow(parousia, ""))
	process_parousia(deltio, parousia)
}

function process_parousia(deltio, parousia,			orario, \
	meraora, diafora, adex) {

	if (split(parousia["orario"], orario, "-") != 2)
	return error(deltio["imerominia"] "@" parousia[""] ": λανθασμένο ωράριο")

	meraora = substr(parousia["meraora"], 0, 11)

	adex = ""
	diafora = "-----"

	if (parousia["adidos"])
	adex = parousia["adidos"]

	else if (parousia["excuse"])
	adex = parousia["excuse"]
	
	else if (deltio["prosapo"] == "ΠΡΟΣΕΛΕΥΣΗ")
	diafora = diafora_calc(parousia["ipalilos"], parousia["meraora"], meraora orario[1])

	else if (deltio["prosapo"] == "ΑΠΟΧΩΡΗΣΗ")
	diafora = diafora_calc(parousia["ipalilos"], meraora orario[2], parousia["meraora"])

	printf "%10s %10s %44.44s %5.5s %-20.20s\n", deltio["imerominia"], \
		deltio["prosapo"], ipalilos(parousia["ipalilos"]), \
		diafora, parousia["adidos"]
}

function diafora_calc(ipalilos, meraora1, meraora2,		query, diafora, a, m) {
	query = "SELECT TIMEDIFF('" meraora2 "', '" meraora1 "')"

	if (spawk_submit(query) != 3)
	fatal(query ": SQL failed")

	spawk_fetchone(diafora)

	if (split(diafora[1], a, ":") != 3)
	return ""

	m = (a[1] * 60) + a[2]

	if (m < orio)
	return ""

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
