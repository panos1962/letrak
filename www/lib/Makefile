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
# Created: 2020-04-13
# @HISTORY END
#
# @END
#
###############################################################################@

PANDORA_DIR = ../mnt/pandora

LETRAK_CSS = letrak.css

PARAGOGA = $(LETRAK_CSS)

STYLUS_OPTS = --print --compress
STYLUS_OPTS = --print

.PHONY: all
all: $(PARAGOGA)

$(LETRAK_CSS): letrak.styl $(PANDORA_DIR)/lib/pandora.css
	stylus $(STYLUS_OPTS) letrak.styl >$@
