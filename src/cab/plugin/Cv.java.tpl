package #PACKAGE#.cv;

public interface #ALIAS#Cv {

    String CONFIG_FOLDER = "plugin/#MODULE#/";

    String INTEGRATION_FILE = CONFIG_FOLDER + "integration.json";

    String CONFIGURATION_FILE = CONFIG_FOLDER + "configuration.json";

    // CMDB 专用数据文件
    // String MAPPING_FILE = CONFIG_FOLDER + "cmdb-v2/mapping/ci.device.json";

    interface Web {
    }

    interface Mock {
        // mock数据文件目录
        // data/mock/demo.json
    }
}