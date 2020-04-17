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
# www/lib/Makefile
# @FILE END
#
# @HISTORY BEGIN
# Updated: 2020-04-17
# Created: 2020-04-13
# @HISTORY END
#
# @END
#
###############################################################################@

LETRAK_CSS = letrak.css
LETRAK_DEBUG_CSS = letrakDebug.css
PANDORA_CSS = pandora.css

PARAGOGA = $(LETRAK_CSS) $(LETRAK_DEBUG_CSS) $(PANDORA_CSS)

STYLUS_OPTS = --print --compress
STYLUS_OPTS = --print

.PHONY: all
all: $(PARAGOGA)

$(LETRAK_CSS): letrak.styl
	stylus $(STYLUS_OPTS) --prefix 'letrak-' letrak.styl >$@

$(LETRAK_DEBUG_CSS): letrakDebug.styl
	stylus $(STYLUS_OPTS) --prefix 'letrak-' letrakDebug.styl >$@

$(PANDORA_CSS): pandora.styl
	stylus $(STYLUS_OPTS) --prefix 'pnd-' pandora.styl >$@

.PHONY: cleanup
cleanup:
	@rm -f $(PARAGOGA)
