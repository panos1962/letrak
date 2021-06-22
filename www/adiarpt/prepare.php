<?php
require_once("../../local/conf.php");
require_once(LETRAK_BASEDIR . "/www/lib/letrak.php");

pandora::
header_json()::
session_init()::
database();

Adiarpt::
init()::
dlist_scan()::
print_results();

class Adiarpt {
	public static $dlist = NULL;
	public static $ipiresia = NULL;
	public static $apo = NULL;
	public static $eos = NULL;

	private static function error_set($err) {
		print '{"error":"' . addslashes($err) . '"}';
		exit(0);
	}

	public static function init() {
		self::$dlist = pandora::post_get("dlist");

		if (!isset(self::$dlist))
		self::error_set("Ακαθόριστη λίστα δελτίων");

		self::$ipiresia = pandora::post_get("ipiresia");

		if (!isset(self::$ipiresia))
		self::error_set("Ακαθόριστη υπηρεσία");

		self::$apo = pandora::post_get("apo");

		if (!isset(self::$apo))
		self::error_set("Ακαθόριστη αρχή διαστήματος");

		self::$eos = pandora::post_get("eos");

		if (!isset(self::$eos))
		self::error_set("Ακαθόριστο τέλος διαστήματος");

		return __CLASS__;
	}

	public static function dlist_scan() {
		foreach ($_POST["dlist"] as $kodikos) {
			if (!is_numeric($kodikos))
			error_set($kodikos . ": λανθασμένος κωδικός δελτίου");

			self::process_deltio($kodikos);
		}

		return __CLASS__;
	}

	public static function process_deltio($kodikos) {
		$query = "SELECT `ipalilos`, `meraora`, " .
			"`adidos`, `excuse`, `info` " .
			"FROM `parousia` " .
			"WHERE `deltio` = " . $kodikos;

		$res = pandora::query($query);

		if (!$res)
		self::error_set("Database error");

		while ($row = $res->fetch_assoc())
		print_r($row);

		$res->close();
		return __CLASS__;
	}

	public static function print_results() {
		print "{}";
	}
}
?>
