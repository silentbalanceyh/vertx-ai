
# 加载环境变量
CURRENT_NAME=${PWD##*/}
API_NAME=${CURRENT_NAME/-domain/-api}
source "../${API_NAME}/.r2mo/app.env"

mvn install -DskipTests=true -Dmaven.javadoc.skip=true
# mvn liquibase:update -e
mvn process-resources flyway:migrate -Dflyway.validateMigrationNaming=true
echo "数据库初始化完成！"