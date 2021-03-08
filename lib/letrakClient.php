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
// Updated: 2021-03-08
// Updated: 2020-06-06
// Updated: 2020-05-06
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
define("LETRAK_DELTIO_PROJECTION_COLUMNS",
	"`kodikos` AS `k`," .
	"`imerominia` AS `i`," .
	"`ipiresia` AS `r`," .
	"`prosapo` AS `o`," .
	"`perigrafi` AS `e`," .
	"`katastasi` AS `s`");
define("LETRAK_PROSOPA_PROJECTION_COLUMNS",
	"`parousia`.`ipalilos` AS `i`, " .
	"`ipalilos`.`eponimo` AS `l`, " .
	"`ipalilos`.`onoma` AS `f`, " .
	"`ipalilos`.`patronimo` AS `r`, " .
	"`parousia`.`orario` AS `o`, " .
	"`parousia`.`karta` AS `k`, " .
	"`parousia`.`meraora` AS `t`, " .
	"`parousia`.`kataxorisi` AS `n`, " .
	"`parousia`.`adidos` AS `a`, " .
	"`parousia`.`adapo` AS `p`, " .
	"`parousia`.`adeos` AS `e`, " .
	"`parousia`.`excuse` AS `x`, " .
	"`parousia`.`info` AS `s`");

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

	public function xparam_get($param) {
		$ipalilos = pandora::session_get(LETRAK_SESSION_IPALILOS);

		$x = new Ipalilos();

		if (!$ipalilos)
		return $x->xparam_get($param);

		try {
			$ipalilos = json_decode($ipalilos);
		} catch (Exception $e) {
			return $x->xparam_get($param);
		}

		if (!isset($ipalilos->xparam))
		return $x->xparam_get($param);

		$x->xparam = (array) $ipalilos->xparam;
		return $x->xparam_get($param);
	}

	// Η μέθοδος "ipografes_taxinomisi" επιχειρεί επεναρίθμηση των
	// υπογραφόντων παρουσιολογίου. Πιο συγκεκριμένα, διατρέχει τις
	// υπογραφές με σειρά που καθορίζεται από τους υφιστάμενους
	// ταξινομικούς αριθμούς και επαναριθμεί εκκινώντας από τον
	// αριθμό 1.

	public static function ipografes_taxinomisi($deltio, $tax = "tax") {
		pandora::query("SET @" . $tax . " := 0");

		$query = "UPDATE `letrak`.`ipografi` SET `taxinomisi` =" .
			" (@" . $tax . " := @" . $tax . " + 1)" .
			" WHERE `deltio` = " . $deltio .
			" ORDER BY `taxinomisi`";
		pandora::query($query);

		$query = "SELECT MIN(`taxinomisi`)" .
			" FROM `letrak`.`ipografi`" .
			" WHERE (`deltio` = " . $deltio . ")" .
			" AND (`checkok` IS NULL)";
		$row = pandora::first_row($query, MYSQLI_NUM);

		if ((!$row) || (!$row[0]))
		return __CLASS__;

		$query = "UPDATE `letrak`.`ipografi`" .
			" SET `checkok` = NULL" .
			" WHERE (`deltio` = " . $deltio . ")".
			" AND (`taxinomisi` > " . $row[0] . ")";
		pandora::query($query);
		return __CLASS__;
	}

	public static function ipografes_json($deltio, $opts = NULL) {
		if ($deltio instanceof Deltio)
		$deltio = $deltio->kodikos_get();

		if (letrak::deltio_invalid_kodikos($deltio))
		return;

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
			" WHERE (`ipografi`.`deltio` = " . $deltio . ")" .
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

	// Η function "fatal_error" χρησιμοποιείται κυρίως μέσα από
	// προγράμματα που καλούνται μέσω ajax και δεν επιστρέφουν
	// δεδομένα, δηλαδή δεν περιμένουμε να εκτυπώσουν κάτι στο
	// output. Σε αυτές τις περιπτώσεις μπορούμε να θεωρήσουμε
	// οποιαδήποτε επιστροφή ως δείγμα σημαντικού σφάλματος ακόμη
	// και αν το πρόγραμμα κάνει exit με μηδενικό status, επομένως
	// η συνήθης κλήση της function είναι με κάποιο (μη κενό)
	// μήνυμα.

	public function fatal_error($msg, $stat = 0) {
		print $msg;
		exit($stat);
	}

	public function fatal_error_json($msg, $tag = "error") {
		print '{"' . $tag . '":' . pandora::json_string($msg) . '}';
		exit(0);
	}
}

letrak::init();
