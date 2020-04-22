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

class letrak extends letrakCore {
	public static $imerisioPrjcols =
		"`kodikos` AS `k`," .
		"`imerominia` AS `d`," .
		"`ipiresia` AS `i`," .
		"`prosapo` AS `t`," .
		"`perigrafi` AS `p`," .
		"`closed` AS `c`";
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
}

letrak::init();
