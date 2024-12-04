#!/usr/bin/env bash

progname="$(basename $0)"

usage() {
	echo "usage: ${progname}" >&2
	exit 1
}

errs=

while getopts ":x:a:bc" opt
do
	case "${opt}" in
	\:)
		echo "${progname}: -${OPTARG}: missing argument" >&2
		errs=1
		;;
	\?)
		echo "${progname}: -${OPTARG}: invalid option" >&2
		errs=1
		;;
	esac
done

[ -n "${errs}" ] && usage

shift $(expr $OPTIND - 1)
[ $# -ne 0 ] && usage

[ -z "${AWKLIBPATH}" ] &&
export AWKLIBPATH="/usr/local/lib/gawk"

[ -z "${PANDORA_BASEDIR}" ] &&
export PANDORA_BASEDIR="/var/opt/pandora"

[ -z "${LETRAK_BASEDIR}" ] &&
export LETRAK_BASEDIR="/var/opt/letrak"

sesamidb="${PANDORA_BASEDIR}/private/sesamidb"
awk -v sesamidb="${sesamidb}" -f "${LETRAK_BASEDIR}/lib/sintel/sintel.awk"


exit 0
