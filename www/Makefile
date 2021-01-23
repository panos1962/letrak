#!/usr/bin/env make -f

###############################################################################@
#
# @BEGIN
#
# @COPYRIGHT BEGIN
# Copyright (C) 2020 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
# @COPYRIGHT END
#
# @FILETYPE BEGIN
# makefile
# @FILETYPE END
#
# @FILE BEGIN
# www/Makefile —— makefile αρχικής σελίδας εφαρμογής "letrak"
# @FILE END
#
# @HISTORY BEGIN
# Created: 2020-04-20
# @HISTORY END
#
# @END
#
###############################################################################@

PANDORA_DIR = ../mnt/pandora

MAIN_CSS = main.css
BUNDLE_JS = bundle.js
README = readme.html

PARAGOGA = $(MAIN_CSS) $(BUNDLE_JS) $(README)

BROWSERIFY_OPTS = -t envify -p tinyify
BROWSERIFY_OPTS = -t envify

STYLUS_OPTS = --print --compress
STYLUS_OPTS = --print

.PHONY: all
all: $(PARAGOGA)

$(MAIN_CSS): main.styl lib/letrak.css lib/pandora.css $(PANDORA_DIR)/www/lib/pandora.css
	stylus $(STYLUS_OPTS) main.styl >$@

$(BUNDLE_JS): \
	$(PANDORA_DIR)/lib/pandoraCore.js \
	$(PANDORA_DIR)/lib/pandoraClient.js \
	main.js \
	lib/letrak.js \
	lib/letrakCore.js
	browserify $(BROWSERIFY_OPTS) -o $@ main.js

$(README): ../README.md
	pandoc -o $(README) $?

.PHONY: cleanup
cleanup:
	@rm -f $(PARAGOGA)
