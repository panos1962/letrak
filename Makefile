#!/usr/bin/env make -f

###############################################################################@
##
## @BEGIN
##
## @COPYRIGHT BEGIN
## Copyright (C) 2020 Panos I. Papadopoulos <panos1962_AT_gmail_DOT_com>
## @COPYRIGHT END
##
## @FILETYPE BEGIN
## makefile
## @FILETYPE END
##
## @FILE BEGIN
## Makefile —— Κεντρικό makefile εφαρμογής "letrak"
## @FILE END
##
## @HISTORY BEGIN
## Created: 2020-03-05
## @HISTORY END
##
## @END
##
###############################################################################@

.SILENT:

.PHONY: all
all:
	@echo 'This is "letrak" project!'
	@make status

# GIT SECTION

.PHONY: status
status:
	git status .

.PHONY: diff
diff:
	git diff .

.PHONY: show
show:
	git add --dry-run .

.PHONY: add
add:
	git add --verbose .

.PHONY: commit
commit:
	git commit --message "modifications" .

.PHONY: push
push:
	git push

.PHONY: git
git:
	-git commit --message "modifications" .; :
	make push
	echo "###################################"
	make status
