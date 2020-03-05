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
// bash // awk // php // javascipt ** css html // makefile // C
// @FILETYPE END
//
// @FILE BEGIN
// FFFFFF —— DDDDDD
// @FILE END
//
// @DESCRIPTION BEGIN
// @@@@@@
// @DESCRIPTION END
//
// @HISTORY BEGIN
// Created: 2020-03-05
// @HISTORY END
//
// @END
//
///////////////////////////////////////////////////////////////////////////////@

if (!class_exists("letrakCore"))
require_once(LETRAK_BASEDIR . "/www/lib/letrakCore.php");

class letrak extends letrakCore {
	private static $init_ok = FALSE;
	private static $server = NULL;

	public static function init() {
		if (self::$init_ok)
		return;

		self::$init_ok = TRUE;

		if (!isset($_HOST))
		pandora::klise_fige(0);

		if (!isset($_SERVER))
		pandora::klise_fige(0);
print "<pre>";
var_dump($_SERVER);
print "</pre>";
	}

	public static function url($x) {
	}
}

letrak::init();
