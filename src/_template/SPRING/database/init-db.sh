#!/usr/bin/env bash
source $PWD/mvn-env.sh
mysql -ur2mo -h"$R2MO_MYSQL_HOST" < "$PWD/database/database-account.sql"
mysql -ur2mo -h"$R2MO_MYSQL_HOST" < "$PWD/database/database-reinit.sql"