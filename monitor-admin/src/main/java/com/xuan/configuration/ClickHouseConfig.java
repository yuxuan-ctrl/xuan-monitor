package com.xuan.configuration;

import com.baomidou.dynamic.datasource.creator.AbstractDataSourceCreator;
import com.baomidou.dynamic.datasource.creator.DataSourceCreator;
import com.baomidou.dynamic.datasource.spring.boot.autoconfigure.DataSourceProperty;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import ru.yandex.clickhouse.BalancedClickhouseDataSource;
import ru.yandex.clickhouse.ClickHouseDataSource;
import ru.yandex.clickhouse.settings.ClickHouseProperties;

import javax.sql.DataSource;
import java.util.Properties;

@Order(0)
@Configuration
@ConditionalOnProperty(name = "spring.datastore.type", havingValue = "clickhouse")
public class ClickHouseConfig extends AbstractDataSourceCreator implements DataSourceCreator {

    @Value("${spring.clickhouse.url}")
    private String url;
    @Value("${spring.clickhouse.username}")
    private String username;
    @Value("${spring.clickhouse.password}")
    private String password;

    @Override
    public DataSource doCreateDataSource(DataSourceProperty dataSourceProperty) {
        Properties properties = new Properties();
        // 使用clickHouse
        properties.setProperty("user", dataSourceProperty.getUsername());
        properties.setProperty("password", dataSourceProperty.getPassword());
        return new BalancedClickhouseDataSource(dataSourceProperty.getUrl(), properties);
    }

    @Override
    public boolean support(DataSourceProperty dataSourceProperty) {
        // 判断是否使用此数据源
        String poolName = dataSourceProperty.getPoolName();
        return "clickHouse".equals(poolName);
    }

}
