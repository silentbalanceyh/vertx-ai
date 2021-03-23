<included>
    <appender name="#LOG_UP#" class="ch.qos.logback.core.rolling.RollingFileAppender">
        <rollingPolicy class="ch.qos.logback.core.rolling.TimeBasedRollingPolicy">
            <fileNamePattern>${LOG_FOLDER}/ox-plugin/plugin-#LOG_L#.log</fileNamePattern>
            <maxHistory>${LOG_MAX_HISTORY}</maxHistory>
        </rollingPolicy>
        <encoder class="ch.qos.logback.classic.encoder.PatternLayoutEncoder">
            <Pattern>${LOG_PATTERN}</Pattern>
        </encoder>
        <triggeringPolicy class="ch.qos.logback.core.rolling.SizeBasedTriggeringPolicy">
            <MaxFileSize>${LOG_MAX_FILE_SIZE}</MaxFileSize>
        </triggeringPolicy>
    </appender>
    <appender name="ASYNC_#LOG_UP#" class="ch.qos.logback.classic.AsyncAppender">
        <discardingThreshold>0</discardingThreshold>
        <queueSize>512</queueSize>
        <appender-ref ref="#LOG_UP#"/>
    </appender>
    <logger name="cn.originx.#LOG_L#" level="INFO">
        <appender-ref ref="ASYNC_#LOG_UP#"/>
    </logger>
</included>