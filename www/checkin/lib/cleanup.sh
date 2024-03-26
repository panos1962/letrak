#!/usr/bin/env bash

progname="$(basename $0)"

usage() {
	echo "usage: ${progname} [-r] [-a] [-t minutes]" >&2
	exit 1
}

errs=
proc="ls -ld"
age=5

while getopts ":rat:" opt
do
	case "${opt}" in
	a)
		age=0
		;;
	r)
		proc="rm -f"
		;;
	t)
		age="${OPTARG}"
		;;
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

shift $(expr "${OPTIND}" - 1)
[ $# -ne 0 ] && usage

[ -z "${LETRAK_BASEDIR}" ] &&
LETRAK_BASEDIR="/var/opt/letrak"

tmpdir="${LETRAK_BASEDIR}/www/checkin/tmp"

[ -d "${tmpdir}" ] || exit 2
[ -w "${tmpdir}" ] || exit 2

find "${tmpdir}" -cmin +"${age}" -type f -name '*.xlsx' | xargs ${proc}
