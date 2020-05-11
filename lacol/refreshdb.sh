#!/usr/bin/env bash

local/createdb.sh | MYSQL_PWD="xxx" mysql -u root && local/dbload.sh
