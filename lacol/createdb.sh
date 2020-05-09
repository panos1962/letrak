#!/usr/bin/env bash

pd_createdb \
-a /home/panos/Local/pandora/database/dbadmin.cf \
-d local/database.cf \
-s KARTELDB=kartel \
database/letrak.sql
