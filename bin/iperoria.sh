#!/usr/bin/env bash

[ -z "${LETRAK_BASEDIR}" ] &&
BLETRAK_ASEDIR="/var/opt/letrak"

progname="$(basename $0)"

usage() {
	echo "usage: ${progname} [ -m minutes ] [ -p ] [ -a ] υπηρεσία ΕΕΕΕΜΜ"
	exit 1
}

err=
proselefsi=
apoxorisi=
total=
orio=30

while getopts ":patm:" opt
do
	case "${opt}" in
	p)
		proselefsi=1
		;;
	a)
		apoxorisi=1
		;;
	t)
		total=1
		;;
	m)
		orio="${OPTARG}"
		;;
	\:)
		echo "${progname}: -${OPTARG}: missing option argument" >&2
		err=1
		;;
	\?)
		echo "${progname}: -${OPTARG}: invalid option" >&2
		err=1
		;;
	esac
done

shift $(expr ${OPTIND} - 1)

[ $# -ne 2 ] && usage

[ -z "${proselefsi}" ] && [ -z "${apoxorisi}" ] && {
	proselefsi=1
	apoxorisi=1
}

exec awk \
-v basedir="${LETRAK_BASEDIR}" \
-v ipiresia="${1}" \
-v yyyymm="${2}" \
-v proselefsi="${proselefsi}" \
-v apoxorisi="${apoxorisi}" \
-v total="${total}" \
-v orio="${orio}" \
-f "${LETRAK_BASEDIR}/lib/std.awk" \
-f "${LETRAK_BASEDIR}/lib/iperoria.awk"
