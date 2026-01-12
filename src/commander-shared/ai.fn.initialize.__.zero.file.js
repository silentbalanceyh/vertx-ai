const fs = require("fs").promises;

const IoUt = require("./ai.fn.initialize.__.io.util");
const Ec = require("../epic");
const ioZeroDatabase = async (source, configuration = {}) => {
    let fileSrc = `${source}/database/database-account.sql.ejs`;
    let fileContent = await IoUt.ioEJS(fileSrc, configuration);
    let fileDest = IoUt.withDPA(configuration, `.r2mo/database/${configuration.dbType}/database-account.sql`);
    await fs.writeFile(fileDest, fileContent.toString(), null);
    Ec.execute("生成文件：" + fileDest.green);

    fileSrc = `${source}/database/database-reinit.sql.ejs`;
    fileContent = await IoUt.ioEJS(fileSrc, configuration);
    fileDest = IoUt.withDPA(configuration, `.r2mo/database/${configuration.dbType}/database-reinit.sql`);
    await fs.writeFile(fileDest, fileContent.toString(), null);
    Ec.execute("生成文件/DB：" + fileDest.green);

    fileSrc = `${source}/database/database-reinit-workflow.sql.ejs`;
    fileContent = await IoUt.ioEJS(fileSrc, configuration);
    fileDest = IoUt.withDPA(configuration, `.r2mo/database/${configuration.dbType}/database-reinit-workflow.sql`);
    await fs.writeFile(fileDest, fileContent.toString(), null);
    Ec.execute("生成文件/WF：" + fileDest.green);

    fileSrc = `${source}/database/database-reinit-history.sql.ejs`;
    fileContent = await IoUt.ioEJS(fileSrc, configuration);
    fileDest = IoUt.withDPA(configuration, `.r2mo/database/${configuration.dbType}/database-reinit-history.sql`);
    await fs.writeFile(fileDest, fileContent.toString(), null);
    Ec.execute("生成文件/HIS：" + fileDest.green);

    fileSrc = `${source}/database/init-db.sh`;
    fileDest = IoUt.withDPA(configuration, "init-db.sh");
    await fs.copyFile(fileSrc, fileDest);
    Ec.execute("拷贝文件：" + fileDest.green);

    return true;
}
const ioZeroConfiguration = async (source, configuration = {}) => {
    let fileSrc = `${source}/mvn-build.sh`;
    let fileDest = IoUt.withDPA(configuration, "mvn-build.sh");
    await fs.copyFile(fileSrc, fileDest);
    Ec.execute("拷贝文件：" + fileDest.green);

    fileSrc = `${source}/app.env.ejs`;
    let fileContent = await IoUt.ioEJS(fileSrc, configuration);
    fileDest = IoUt.withDPA(configuration, `.r2mo/app.env`);
    await fs.writeFile(fileDest, fileContent.toString(), null);
    Ec.execute("生成文件：" + fileDest.green);
    return true;
}
module.exports = {
    ioZeroDatabase,
    ioZeroConfiguration
}