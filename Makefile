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
# Makefile —— Κεντρικό makefile εφαρμογής "letrak"
# @FILE END
#
# @HISTORY BEGIN
# Updated: 2022-03-05
# Updated: 2021-06-21
# Updated: 2020-04-12
# Created: 2020-03-05
# @HISTORY END
#
# @END
#
###############################################################################@

.SILENT:

.PHONY: all
all:
	(cd www/lib && make)
	(cd www && make)
	(cd www/isodos && make)
	(cd www/deltio && make)
	(cd www/prosopa && make)
	(cd www/adiarpt && make)
	(cd www/admin && make)
	(cd www/diafores && make)

test:
	make all
	bash local/test.sh

# GIT SECTION
# This is a test!

.PHONY: status
status:
	git status .

.PHONY: diff
diff:
	git diff .

.PHONY: showadd
showadd:
	git add --dry-run .

.PHONY: add
add:
	git add --verbose .

.PHONY: commit
commit:
	git commit --message "modifications" .; :

.PHONY: push
push:
	git push

.PHONY: git
git:
	-git commit --message "modifications" .
	make push
	echo "###################################"
	make status

.PHONY: pull
pull:
	git pull && make

# FILE SECTION

.PHONY: cleanup
cleanup:
	@(cd www/admin && make cleanup)
	@(cd www/adiarpt && make cleanup)
	@(cd www/prosopa && make cleanup)
	@(cd www/deltio && make cleanup)
	@(cd www/isodos && make cleanup)
	@(cd www && make cleanup)
	@(cd www/lib && make cleanup)
