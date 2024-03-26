#!/usr/bin/env bash

[ -z "${LETRAK_BASEDIR}" ] &&
LETRAK_BASEDIR="/var/opt/letrak"

tmpdir="${LETRAK_BASEDIR}/www/checkin/tmp"

[ -d "${tmpdir}" ] || exit 2
[ -w "${tmpdir}" ] || exit 2

find "${tmpdir}" -cmin +5 -type f -name '*.xlsx' | xargs rm -f
