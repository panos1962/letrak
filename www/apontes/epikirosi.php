<?php
///////////////////////////////////////////////////////////////////////////////@
//
// @BEGIN
//
// @COPYRIGHT BEGIN
// Copyright (C) 2024 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
// @COPYRIGHT END
//
// @FILETYPE BEGIN
// php
// @FILETYPE END
//
// @FILE BEGIN
// www/apontes/epikirosi.php —— Επικύρωση παρουσιολογίων ημέρας από το δελτίο
// απόντων.
// @FILE END
//
// @DESCRIPTION BEGIN
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Created: 2024-11-23
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

Epikirosi::
init();

///////////////////////////////////////////////////////////////////////////////@

class Epikirosi {
	public static function init() {
		$prosvasi = letrak::prosvasi_check();

		if (!$prosvasi)
		letrak::fatal_error_json("Ακαθόριστο επίπεδο πρόσβασης χρήστη");

		$ipiresia = pandora::parameter_get("ipiresia");

		if (!$ipiresia)
		letrak::fatal_error_json("Ακαθόριστη οργανική μονάδα");

		if ($prosvasi->ipiresia_oxi_admin($ipiresia))
		letrak::fatal_error_json("Δεν υπάρχουν δικαιώματα επικύρωσης");

		$pro = pandora::parameter_get("pro");
		$apo = pandora::parameter_get("apo");

		$pro = self::deltio_fetch($pro);

		if ($apo)
		$apo = self::deltio_fetch($apo);

		self::epikirosi($pro);

		if ($apo)
		self::epikirosi($apo);

		print "{}";

		return __CLASS__;
	}

	private static function epikirosi($deltio) {
		if (!$deltio)
		return __CLASS__;

		$query = "UPDATE `letrak`.`deltio` SET `katastasi` = " .
			pandora::sql_string(LETRAK_DELTIO_KATASTASI_EPIKIROMENO) .
			" WHERE (`kodikos` = " . $deltio->kodikos_get() . ")" .
			" AND (`katastasi` = " .
			pandora::sql_string(LETRAK_DELTIO_KATASTASI_KIROMENO) . ")";

		pandora::query($query);

		return __CLASS__;
	}

	private static function deltio_fetch($kodikos) {
		if (letrak::deltio_invalid_kodikos($kodikos))
		letrak::fatal_error_json($kodikos . ": απροσδιόριστος κωδικός δελτίου");

		$deltio = (new Deltio())->from_database($kodikos);

		if ($deltio->oxi_kodikos())
		letrak::fatal_error_json($kodikos . ": ακαθόριστο δελτίο");

		return $deltio;
	}
}
?>
