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

$response = array();
print "{";

///////////////////////////////////////////////////////////////////////////////@

$query = "SELECT " .
	"`kodikos` AS `k`, " .
	"`imerominia` AS `d`, " .
	"`ipiresia` AS `i`, " .
	"`prosapo` AS `t`, " .
	"`closed` AS `c` " .
	"FROM `letrak`.`imerisio`";

$enotiko = " WHERE";

$x = pandora::parameter_get("imerominia");

if ($x) {
	$query .= $enotiko . " (`imerominia` <= '2020-04-25')";
	$enotiko = " AND ";
}

$x = pandora::parameter_get("ipiresia");

if ($x) {
	$query .= $enotiko . " (`ipiresia` LIKE " .
	pandora::sql_string($x + '%') . ")";
	$enotiko = " AND ";
}

$x = pandora::parameter_get("kodikos");

if ($x) {
	$query .= $enotiko . " (`kodikos` < " . $x . ")";
	$enotiko = " AND ";
}

$query .= " ORDER BY `imerominia`, `ipiresia`, `kodikos` LIMIT 20";
$result = pandora::query($query);

$enotiko = '"imerisio":[';
while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
	print $enotiko . pandora::json_string($row);
	$enotiko = ",";
}

print '],';

///////////////////////////////////////////////////////////////////////////////@

print '"error":""}';
exit(0);
?>
