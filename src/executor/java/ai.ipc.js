const Ux = require('../../epic');
const formatSpace = (line, limit = 45) => {
    const length = limit - line.length;
    for (let i = 0; i < length; i++) {
        line = line + ' '
    }
    return line;
};
const analyzeServer = (line = "") => {
    const start = line.indexOf("\"");
    const end = line.lastIndexOf("\"");
    return (line.substring(start + 1, end))
};
const analyzeClient = (line) => {
    const segments = line.split(',');
    const name = analyzeServer(segments[0]);
    const address = analyzeServer(segments[1]);
    return {name, address};
};
const analyzeFile = (name, file, servers = [], clients = []) => {
    const content = Ux.ioString(file.path);
    const lines = content.split('\n');
    lines.forEach(line => {
        if (0 < line.indexOf("Ux.thenRpc")) {
            const clientData = analyzeClient(line);
            const client = {};
            client.address = clientData.address;
            client.name = clientData.name;
            client.current = name;
            clients.push(client);
        }
        if (0 < line.indexOf("@Ipc")) {
            const serverAddr = analyzeServer(line);
            const server = {};
            server.address = serverAddr;
            server.current = name;
            servers.push(server);
        }
    })
};
const analyzeFolder = (name, path) => {
    const files = Ux.ioFiles(path);
    const server = [];
    const client = [];
    files.forEach(file => analyzeFile(name, file, server, client));
    return {server, client};
};
const zeroIpc = () => {
    const actual = Ux.executeInput(
        [],
        [
            ['-o', '--out', '.']
        ]
    );
    Ux.cxExist(actual["out"]);
    const pathes = Ux.cycleChildren(actual['out'], false);
    // 项目读取
    const projects = {};
    pathes.forEach(path => {
        const mavenFile = path + "/pom.xml";
        if (Ux.isExist(mavenFile)) {
            const name = Ux.ioName(path);
            projects[name] = Ux.cycleChildren(path + '/src/main/java/');
        }
    });
    // 分析单个项目
    let serverData = [];
    let clientData = [];
    Ux.itObject(projects, (field, folders) => folders.forEach(folder => {
        const {server = [], client = []} = analyzeFolder(field, folder);
        Ux.itArray(server, each => each.name = field);
        serverData = serverData.concat(server);
        clientData = clientData.concat(client);
    }));
    // 收集数据完成
    const items = [];
    Ux.itArray(clientData, (client) => {
        const server = serverData.filter(item => item.address === client.address)[0];
        if (server) {
            const item = {};
            item.clientAddr = client.address;
            item.client = client.current;
            item.server = server.current;
            item.self = client.current === server.current;
            items.push(item);
        }
    });
    // 打印IPC信息
    items.forEach(item => {
        const content = `[ IPC ] 地址：${formatSpace(item.clientAddr).yellow.bold} ` +
            `客户端：${formatSpace(item.client, 15).red.bold} --> ` + formatSpace("", 6) +
            `服务端：${formatSpace(item.server, 15).blue.bold}` +
            `自调用：${formatSpace(item.self ? "是".red : "否".green)}`;
        Ux.info(content);
    });
    Ux.info("[ IPC ] 分析完成！！！".cyan.bold);
};

module.exports = {
    zeroIpc
};