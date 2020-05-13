#!/usr/bin/env bash

pd_createdb \
-a /home/panos/Local/pandora/database/dbadmin.cf \
-d /var/opt/letrak/local/database.cf \
-s KARTELDB=kartel \
/var/opt/letrak/database/letrak.sql
