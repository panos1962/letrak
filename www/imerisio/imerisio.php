<?php
///////////////////////////////////////////////////////////////////////////////@
//
// @BEGIN
//
// @COPYRIGHT BEGIN
// Copyright (C) 2020 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
// @COPYRIGHT END
//
// @FILETYPE BEGIN
// php
// @FILETYPE END
//
// @FILE BEGIN
// www/imerisio/imerisio.php —— Πρόγραμμα επιλογής παρουσιολογίων
// @FILE END
//
// @DESCRIPTION BEGIN
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Created: 2020-04-21
// @HISTORY END
//
// @END
//
///////////////////////////////////////////////////////////////////////////////@

require_once("../../local/conf.php");
require_once(LETRAK_BASEDIR . "/www/lib/letrak.php");

pandora::
header_json()::
session_init()::
database();

print "{";

///////////////////////////////////////////////////////////////////////////////@

$query = "SELECT " . letrak::$imerisioPrjcols . " FROM `letrak`.`imerisio`";
$enotiko = " WHERE";

$x = pandora::parameter_get("imerominia");

if ($x) {
	$query .= $enotiko . " (`imerominia` <= " .
		pandora::sql_string($x) . ")";
	$enotiko = " AND ";
}

$x = pandora::parameter_get("ipiresia");

if ($x) {
	$query .= $enotiko . " (`ipiresia` LIKE " .
	pandora::sql_string($x . '%') . ")";
	$enotiko = " AND ";
}

$x = pandora::parameter_get("kodikos");

if ($x) {
	$query .= $enotiko . " (`kodikos` < " . $x . ")";
	$enotiko = " AND ";
}

$query .= " ORDER BY " .
"`imerominia` DESC, " .
"`ipiresia` DESC, " .
"`kodikos` DESC " .
"LIMIT 20";

print '"imerisioQuery":' . pandora::json_string($query) . ",";
print '"imerisio":[';

$result = pandora::query($query);

$enotiko = '';
while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
	print $enotiko . pandora::json_string($row);
	$enotiko = ",";
}

print '],';

///////////////////////////////////////////////////////////////////////////////@

print '"error":""}';
exit(0);
?>
