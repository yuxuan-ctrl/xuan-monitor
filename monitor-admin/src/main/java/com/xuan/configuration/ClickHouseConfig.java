package com.xuan.configuration;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import ru.yandex.clickhouse.ClickHouseDataSource;
import ru.yandex.clickhouse.settings.ClickHouseProperties;

import javax.sql.DataSource;

@Configuration
@ConditionalOnProperty(name = "spring.datastore.type", havingValue = "clickhouse")
public class ClickHouseConfig {

    @Value("${spring.clickhouse.url}")
    private String url;
    @Value("${spring.clickhouse.username}")
    private String username;
    @Value("${spring.clickhouse.password}")
    private String password;

//    @Bean
//    @Qualifier("clickhouseDataSource") // 添加Qualifier注解以标识这是ClickHouse的数据源
//    public DataSource clickhouseDataSource() {
//        ClickHouseProperties properties = new ClickHouseProperties();
//        properties.setUser(username);
//        properties.setPassword(password);
//
//        return new ClickHouseDataSource(url,properties);
//    }
}
