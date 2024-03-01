import com.xuan.MonitorApplication;
import com.xuan.task.TrafficAnalyticsAggregationTask;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.IOException;
import java.sql.*;

//@SpringBootTest(classes = MonitorApplication.class)// 启动整个Spring Boot应用上下文
//@RunWith(SpringRunner.class)
@Slf4j
public class TestClickHouse {
   private static Connection connection = null;


    @Autowired
    private TrafficAnalyticsAggregationTask trafficAnalyticsAggregationTask; // 注入TrafficAnalyticsAggregationTask实例

    @Test
    public void testAggregateYesterdayData() throws IOException, ClassNotFoundException, SQLException {
        Class.forName("ru.yandex.clickhouse.ClickHouseDriver");// 驱动包
         String url = "jdbc:clickhouse://127.0.0.1:8123/";// url路径
        String user = "default";// 账号
         String password = "";// 密码
       connection = DriverManager.getConnection(url, user, password);

        Statement statement = connection.createStatement();
         ResultSet resultSet = statement.executeQuery("select * from system.functions");
         ResultSetMetaData metaData = resultSet.getMetaData();
        int columnCount = metaData.getColumnCount();
    while (resultSet.next()) {
               for (int i = 1; i <= columnCount; i++) {
                    System.out.println(metaData.getColumnName(i) + ":" + resultSet.getString(i));
                  }
           }
    }
}
