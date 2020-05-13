#!/usr/bin/env bash

local/createdb.sh | MYSQL_PWD="xxx" mysql -u root &&
awk -f local/dbload.awk local/data/orario.tsv
