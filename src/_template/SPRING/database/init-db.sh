#!/usr/bin/env bash
source $PWD/mvn-env.sh
mysql -ur2mo -h"$R2MO_MYSQL_HOST" < "$PWD/database/${R2MO_CLOUD_DB_TYPE}/database-account.sql"
mysql -ur2mo -h"$R2MO_MYSQL_HOST" < "$PWD/database/${R2MO_CLOUD_DB_TYPE}/database-reinit.sql"