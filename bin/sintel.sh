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
# τα παρουσιολόγια των τελευταίων ημερών) και εκτυπώνει τους συντάκτες που
# δεν έχουν δηλωμένο τηλέφωνο επικοινωνίας.
# @DESCRIPTION END
#
# @HISTORY BEGIN
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

while getopts ":d:" opt
do
	case "${opt}" in
	d)
		meres="${OPTARG}"
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

awk \
-v progname="${progname}" \
-v sesamidb="${sesamidb}" \
-v meres="${meres}" \
-f "${LETRAK_BASEDIR}/lib/sintel/sintel.awk"

exit 0
