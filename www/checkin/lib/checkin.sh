#!/usr/bin/env bash

progname="$(basename $0)"

usage() {
	echo "usage: ${progname} \
[-x filename] \
[-c] \
[-d date] \
[-s site] \
[-f from] \
[-t to]" >&2
	exit 1
}

errs=
post="cat"
count=
date="$(date +'%Y-%m-%d')"
site="NDM"
apo="05:00:00"
eos="11:00:00"

while getopts ":x:cd:s:f:t:" opt
do
	case "${opt}" in
	x)
		post="ssconvert \
--import-type=Gnumeric_stf:stf_csvtab \
--export-type=Gnumeric_Excel:xlsx \
fd://0 ${OPTARG}.xlsx"
		;;
	c)
		count=1
		;;
	d)
		date="${OPTARG}"
		;;
	s)
		site="${OPTARG}"
		;;
	f)
		apo="${OPTARG}"
		;;
	t)
		eos="${OPTARG}"
		;;
	\:)
		echo "${progname}: -${OPTARG}: missing option argument" >&2
		errs=1
		;;
	\?)
		echo "${progname}: -${OPTARG}: invalid option" >&2
		errs=1
		;;
	esac
done

[ -n "${errs}" ] && usage

shift $(expr ${OPTIND} - 1)
[ $# -ne 0 ] && usage

[ -z "${PANDORA_BASEDIR}" ]
PANDORA_BASEDIR="/var/opt/pandora"

sesamidb="${PANDORA_BASEDIR}/private/sesamidb"

if [ ! -r "${sesamidb}" ]; then
	echo "${progname}: ${sesamidb}: cannot read" >&2
	exit 2
fi

dbuser="pandora"
export MYSQL_PWD="$(awk '$1 == "'${dbuser}'" { print $2 }' "${sesamidb}")"

usrtmp="/usr/tmp"
systmp="/tmp"
tmpdir="${systmp}"
[ -d "${usrtmp}" ] && [ -w "${usrtmp}" ] && tmpdir="${usrtmp}"
unset usrtmp systmp

basedir="/var/opt/letrak/www/checkin/lib"

sqlrun() {
	mysql --skip-column-names -u "${dbuser}" "$@" || exit 2
}

etad="$(echo "SELECT DATE_SUB('${date}', INTERVAL 30 DAY)" | sqlrun)" || exit 2

sqledit() {
	sed "s;_DATE_;${date};g
s;_ETAD_;${etad};g
s;_SITE_;${site};g
s;_APO_;${apo};g
s;_EOS_;${eos};g" $1
}

{
	sqlrun <${basedir}/ipalilos.sql
	sqlrun <${basedir}/ipiresia.sql
	sqledit ${basedir}/deltio.sql | sqlrun | sed 's/.*//g'
	sqledit ${basedir}/parousia.sql | sqlrun | awk -f "${basedir}/parousia.awk"
	sqledit ${basedir}/event.sql | sqlrun
} |\
awk -v count="${count}" -f "${basedir}/report.awk" 2>/dev/null |\
sort -t'	' -k1,1 -k3,3 -k5,5 -k4n,4n | ${post} 2>/dev/null

echo "Εκτυπώθηκαν συμβάντα για ${date}, από ${apo} μέχρι ${eos}" >&2
