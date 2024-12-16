#!/usr/bin/env bash

# @BEGIN
#
# @COPYRIGHT BEGIN
# Copyright (C) 2020 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
# @COPYRIGHT END
#
# @FILETYPE BEGIN
# bash
# @FILETYPE END
#
# @FILE BEGIN
# bin/sintel —— Ημερήσιο δελτίο συντακτών χωρίς τηλέφωνο επικοινωνίας
# @FILE END
#
# @DESCRIPTION BEGIN
# Το παρόν πρόγραμμα επιλέγει τα νέα παρουσιολόγια (by default επιλέγονται
# τα παρουσιολόγια των τελευταίων επτά ημερών) και εκτυπώνει τους συντάκτες
# που δεν έχουν δηλωμένο τηλέφωνο επικοινωνίας. Θυμίζουμε ότι το τηλέφωνο
# επικοινωνίας δηλώνεται στον πίνακα "prosvasi" της database "erpota" τη
# στιγμή που καταχωρούμε δικαίωμα ενημέρωσης (update) για κάποιον υπάλληλο.
# @DESCRIPTION END
#
# @HISTORY BEGIN
# Updated: 2024-12-16
# Updated: 2024-12-08
# Created: 2024-12-04
# @HISTORY END
#
# @END

progname="$(basename $0)"

usage() {
	echo "usage: ${progname}" >&2
	exit 1
}

errs=
meres=7
email=

while getopts ":d:m:" opt
do
	case "${opt}" in
	d)
		meres="${OPTARG}"
		;;
	m)
		email="${OPTARG}"
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

shift $(expr $OPTIND - 1)
[ $# -ne 0 ] && usage

[ -z "${AWKLIBPATH}" ] &&
export AWKLIBPATH="/usr/local/lib/gawk"

[ -z "${PANDORA_BASEDIR}" ] &&
export PANDORA_BASEDIR="/var/opt/pandora"

[ -z "${LETRAK_BASEDIR}" ] &&
export LETRAK_BASEDIR="/var/opt/letrak"

sesamidb="${PANDORA_BASEDIR}/private/sesamidb"

tmp1="/tmp/$$st1"

cleanup() {
	rm -f "${tmp1}"
	[ $# -gt 0 ] && exit $1
}

trap "cleanup; exit 2" 1 2 3 15

awk \
-v progname="${progname}" \
-v sesamidb="${sesamidb}" \
-v meres="${meres}" \
-f "${LETRAK_BASEDIR}/lib/sintel/sintel.awk" >"${tmp1}"

[ -s ${tmp1} ] || cleanup 0

if [ -n "${email}" ]; then
	pd_sendmail \
		-f "no-reply@thessaloniki.gr" \
		-t "${email}" \
		-s "Συντάκτες παρουσιολογίων χωρίς τηλέφωνα επικοινωνίας" \
		"${tmp1}"
	err="${?}"
	cleanup "${err}"
fi

cat "${tmp1}"
err="${?}"
cleanup "${err}"
