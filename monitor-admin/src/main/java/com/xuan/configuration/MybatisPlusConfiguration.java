package com.xuan.configuration;

import com.baomidou.mybatisplus.annotation.DbType;
import com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.PaginationInnerInterceptor;
import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.mybatis.spring.annotation.MapperScan;
import org.mybatis.spring.mapper.MapperScannerConfigurer;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.transaction.PlatformTransactionManager;

import javax.sql.DataSource;
import java.util.Properties;

@Configuration
// @MapperScan(basePackages = {"com.xuan.dao.mapper.clickhouse"}, sqlSessionTemplateRef = "clickhouseSqlSessionTemplate")
// @MapperScan(basePackages = {"com.xuan.dao.mapper.postgres"}, sqlSessionTemplateRef = "postgresSqlSessionTemplate")
public class MybatisPlusConfiguration {

    /**
     * MyBatisPlus拦截器（用于分页）
     */
    @Bean
    public static MybatisPlusInterceptor paginationInterceptor() {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        // 添加MySQL的分页拦截器
        interceptor.addInnerInterceptor(new PaginationInnerInterceptor(DbType.POSTGRE_SQL));
        return interceptor;
    }

//    @Bean(name = "clickhouseDataSource")
//    @ConfigurationProperties(prefix = "spring.datasource.clickhouse")
//    public static DataSource clickhouseDataSource() {
//        return DataSourceBuilder.create().build();
//    }
//
//    @Bean(name = "postgresDataSource")
//    @ConfigurationProperties(prefix = "spring.datasource.postgres")
//    public static DataSource postgresDataSource() {
//        return DataSourceBuilder.create().build();
//    }
//
//    @Bean(name = "clickhouseSqlSessionFactory")
//    public static SqlSessionFactory clickhouseSqlSessionFactory(@Qualifier("clickhouseDataSource") DataSource dataSource) throws Exception {
//        SqlSessionFactoryBean factoryBean = new SqlSessionFactoryBean();
//        factoryBean.setDataSource(dataSource);
//        Properties mybatisProperties = new Properties();
//        // 根据ClickHouse的特性配置MyBatis属性（如有必要）
//        // mybatisProperties.setProperty("...");
//        factoryBean.setConfigurationProperties(mybatisProperties);
//        factoryBean.setMapperLocations(new PathMatchingResourcePatternResolver().getResources("classpath:mapper/clickhouse/xml/*.xml"));
//        return factoryBean.getObject();
//    }
//
//    @Bean(name = "postgresSqlSessionFactory")
//    public static SqlSessionFactory postgresSqlSessionFactory(@Qualifier("postgresDataSource") DataSource dataSource) throws Exception {
//        SqlSessionFactoryBean factoryBean = new SqlSessionFactoryBean();
//        factoryBean.setDataSource(dataSource);
//        Properties mybatisProperties = new Properties();
//        // 根据PostgreSQL的特性配置MyBatis属性（如有必要）
//        // mybatisProperties.setProperty("...");
//        factoryBean.setConfigurationProperties(mybatisProperties);
//        factoryBean.setMapperLocations(new PathMatchingResourcePatternResolver().getResources("classpath:mapper/postgres/xml/*.xml"));
//        return factoryBean.getObject();
//    }
//
//      /**
//     * 自动扫描Mapper接口，这里的包名替换为你的Mapper接口所在的实际包名
//     */
//    @Bean
//    public static MapperScannerConfigurer mapperScannerConfigurer() {
//        MapperScannerConfigurer scannerConfigurer = new MapperScannerConfigurer();
//        scannerConfigurer.setSqlSessionFactoryBeanName("postgresSqlSessionFactory");
//        scannerConfigurer.setBasePackage("com.xuan.dao.mapper.postgres"); // 替换为你的Mapper接口所在的包名
//        return scannerConfigurer;
//    }
//
//
//    // 为每个数据源提供事务管理器
//    @Bean(name = "clickhouseTransactionManager")
//    public static PlatformTransactionManager clickhouseTransactionManager(@Qualifier("clickhouseDataSource") DataSource dataSource) {
//        return new DataSourceTransactionManager(dataSource);
//    }
//
//    @Bean(name = "postgresTransactionManager")
//    public static PlatformTransactionManager postgresTransactionManager(@Qualifier("postgresDataSource") DataSource dataSource) {
//        return new DataSourceTransactionManager(dataSource);
//    }
//
//    @Bean(name = "clickhouseSqlSessionTemplate")
//    public static SqlSessionTemplate clickhouseSqlSessionTemplate(@Qualifier("clickhouseSqlSessionFactory") SqlSessionFactory sqlSessionFactory) {
//        return new SqlSessionTemplate(sqlSessionFactory);
//    }
//
//    @Bean(name = "postgresSqlSessionTemplate")
//    public static SqlSessionTemplate postgresSqlSessionTemplate(@Qualifier("postgresSqlSessionFactory") SqlSessionFactory sqlSessionFactory) {
//        return new SqlSessionTemplate(sqlSessionFactory);
//    }

    /**
     * 注册自定义类型处理器
     */

//    @Bean
//    public void registerCustomTypeHandlers() {
//        TypeHandlerRegistry typeHandlerRegistry = sqlSessionFactory.getConfiguration().getTypeHandlerRegistry();
//        // 注册自定义Map到JSON的类型处理器
//        typeHandlerRegistry.register(Map.class, MapToJsonTypeHandler.class);
//    }

}
