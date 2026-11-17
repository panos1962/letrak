@load "spawk.so"

BEGIN {
	read_spawk_conf()
}

function read_spawk_conf(			cfile, fs) {
	if (!basedir)
	basedir = "/var/opt/letrak"

	cfile = basedir "/local/database.cf"
	fs = FS
	FS = "="

	while ((err = getline <cfile) > 0) {
		gsub(/"/, "", $2)
		spawk_sesami[$1] = $2
	}

	if (err)
	fatal(cfile ": cannot read")

	close(cfile)
	FS = fs

	spawk_sesami["dbpassword"] = spawk_sesami["dbpass"]
}

function error(s) {
	print s >"/dev/stderr"
	return 1
}

function fatal(s) {
	error(s)
	exit(2)
}
