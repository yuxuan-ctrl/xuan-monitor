import com.xuan.MonitorApplication;
import com.xuan.task.TrafficAnalyticsAggregationTask;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.IOException;

@SpringBootTest(classes = MonitorApplication.class)// 启动整个Spring Boot应用上下文
@RunWith(SpringRunner.class)
@Slf4j
public class TestTask {

    @Autowired
    private TrafficAnalyticsAggregationTask trafficAnalyticsAggregationTask; // 注入TrafficAnalyticsAggregationTask实例

    @Test
    public void testAggregateYesterdayData() throws IOException {
        trafficAnalyticsAggregationTask.aggregateYesterdayData();
    }
}
