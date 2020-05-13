#!/usr/bin/env bash

lacol/createdb.sh | MYSQL_PWD="xxx" mysql -u root &&
awk -f lacol/dbload.awk lacol/data/orario.tsv
