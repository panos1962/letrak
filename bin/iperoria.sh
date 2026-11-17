#!/usr/bin/env bash

[ -z "${LETRAK_BASEDIR}" ] &&
BLETRAK_ASEDIR="/var/opt/letrak"

progname="$(basename $0)"

usage() {
	echo "usage: ${progname} [ -m minutes ] υπηρεσία ΕΕΕΕΜΜ"
	exit 1
}

err=
orio=30

while getopts ":m:" opt
do
	case "${opt}" in
	\:)
		echo "${progname}: -${OPTARG}: missing option argument" >&2
		err=1
		;;
	\?)
		echo "${progname}: -${OPTARG}: invalid option" >&2
		err=1
		;;
	m)
		orio="${OPTARG}"
		;;
	esac
done

shift $(expr ${OPTIND} - 1)

[ $# -ne 2 ] && usage
		
exec awk \
-v basedir="${LETRAK_BASEDIR}" \
-v ipiresia="${1}" \
-v yyyymm="${2}" \
-v orio="${orio}" \
-f "${LETRAK_BASEDIR}/lib/std.awk" \
-f "${LETRAK_BASEDIR}/lib/iperoria.awk"
