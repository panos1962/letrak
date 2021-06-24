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
# www/adiarpt/Makefile —— Makefile
# @FILE END
#
# @HISTORY BEGIN
# Created: 2021-06-21
# @HISTORY END
#
# @END
#
###############################################################################@

PANDORA_DIR = ../../mnt/pandora

MAIN_CSS = main.css
DEBUG_CSS = mainDebug.css
PRINT_CSS = mainPrint.css

BUNDLE_JS = bundle.js

PARAGOGA = $(MAIN_CSS) $(DEBUG_CSS) $(PRINT_CSS) $(BUNDLE_JS)

BROWSERIFY_OPTS = -t envify -p tinyify
BROWSERIFY_OPTS = -t envify

STYLUS_OPTS = --print --compress
STYLUS_OPTS = --print

.PHONY: all
all: $(PARAGOGA)

$(MAIN_CSS): \
	main.styl \
	../lib/letrak.css \
	../lib/pandora.css \
	../mnt/pandora/lib/pandora.css
	stylus $(STYLUS_OPTS) main.styl >$@

$(PRINT_CSS): \
	mainPrint.styl
	stylus $(STYLUS_OPTS) mainPrint.styl >$@

$(DEBUG_CSS): mainDebug.styl
	stylus $(STYLUS_OPTS) mainDebug.styl >$@

$(BUNDLE_JS): \
	$(PANDORA_DIR)/lib/pandoraCore.js \
	$(PANDORA_DIR)/lib/pandoraClient.js \
	main.js \
	ektiposi.js \
	../lib/letrak.js \
	../lib/letrakCore.js
	browserify $(BROWSERIFY_OPTS) -o $@ main.js

.PHONY: cleanup
cleanup:
	@rm -f $(PARAGOGA)
