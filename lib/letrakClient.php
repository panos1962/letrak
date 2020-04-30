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
// www/lib/letrakClient.php —— Βασική PHP βιβλιοθήκη για client εφαρμογές.
// @FILE END
//
// @DESCRIPTION BEGIN
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Updated: 2020-04-09
// Created: 2020-03-05
// @HISTORY END
//
// @END
//
///////////////////////////////////////////////////////////////////////////////@

if (!class_exists("pandoraCore"))
require_once(PANDORA_BASEDIR . "/lib/pandoraCore.php");

if (!class_exists("pandora"))
require_once(PANDORA_BASEDIR . "/www/lib/pandora.php");

if (!class_exists("letrakCore"))
require_once(LETRAK_BASEDIR . "/www/lib/letrakCore.php");

define("LETRAK_SESSION_IPALILOS", "letrak_session_ipalilos");
define("LETRAK_IMERISIO_PROJECTION_COLUMNS",
	"`kodikos` AS `k`," .
	"`imerominia` AS `i`," .
	"`ipiresia` AS `r`," .
	"`prosapo` AS `o`," .
	"`perigrafi` AS `e`," .
	"`closed` AS `c`");
define("LETRAK_PROSOPA_PROJECTION_COLUMNS",
	"`parousia`.`ipalilos` AS `i`, " .
	"`parousia`.`karta` AS `k`, " .
	"`parousia`.`orario` AS `o`, " .
	"`parousia`.`meraora` AS `t`, " .
	"`parousia`.`excuse` AS `e`, " .
	"`parousia`.`info` AS `s`, " .
	"`ipalilos`.`eponimo` AS `l`, " .
	"`ipalilos`.`onoma` AS `f`, " .
	"`ipalilos`.`patronimo` AS `p`");

class letrak extends letrakCore {
	private static $init_ok = FALSE;

	public static function init() {
		if (self::$init_ok)
		return;

		self::$init_ok = TRUE;

		if (!isset($_SERVER))
		exit(0);
	}

	public static function is_xristis() {
		return pandora::session_get(LETRAK_SESSION_IPALILOS);
	}

	public static function oxi_xristis() {
		return !self::is_xristis();
	}

	public static function prosvasi_get() {
		$prosvasi = new Prosvasi();
		$ipalilos = pandora::session_get(LETRAK_SESSION_IPALILOS);

		if (!$ipalilos)
		return $prosvasi;

		try {
			$ipalilos = json_decode($ipalilos);
			$prosvasi->ipalilos_set($ipalilos->kodikos);
		} catch (Exception $e) {
			return $prosvasi;
		}

		return $prosvasi->fromdb();
	}

	public static function ipografes_taxinomisi($imerisio, $tax = "tax") {
		pandora::query("SET @" . $tax . " := 0");

		$query = "UPDATE `letrak`.`ipografi` SET `taxinomisi` =" .
			" (SELECT @" . $tax . " := @" . $tax . " + 1)" .
			" WHERE `imerisio` = " . $imerisio .
			" ORDER BY `taxinomisi`";
		pandora::query($query);
		return __CLASS__;
	}

	public static function ipografes_json($imerisio, $opts = NULL) {
		if (!isset($opts))
		$opts = array();

		$ipalilos_table = letrak::erpota12("ipalilos");
		$query = "SELECT " .
			"`ipografi`.`taxinomisi` AS `x`, " .
			"`ipografi`.`titlos` AS `t`, " .
			"`ipografi`.`armodios` AS `a`, " .
			"`ipalilos`.`eponimo` AS `e`, " .
			"`ipalilos`.`onoma` AS `o`, " .
			"`ipografi`.`checkok` AS `c`" .
			" FROM `letrak`.`ipografi` AS `ipografi` " .
			" LEFT JOIN " . $ipalilos_table . " AS `ipalilos` " .
			" ON `ipalilos`.`kodikos` = `ipografi`.`armodios`" .
			" WHERE (`ipografi`.`imerisio` = " . $imerisio . ")" .
			" ORDER BY `x`";
		$result = pandora::query($query);

		if (array_key_exists("query", $opts) && $opts["query"])
		print pandora::json_string($opts["query"]) . ':' .
			pandora::json_string($query) . ',';

		if (!array_key_exists("ipografes", $opts))
		$opts["ipografes"] = "ipografes";

		print pandora::json_string($opts["ipografes"]) . ':[';

		$enotiko = "";
		while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
			print $enotiko . pandora::json_string
				(pandora::null_purge($row));
			$enotiko = ",";
		}

		print ']';
	}
}

letrak::init();
