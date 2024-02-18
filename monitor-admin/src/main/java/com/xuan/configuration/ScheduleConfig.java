package com.xuan.configuration;

import com.xuan.service.ESDocumentService;
import com.xuan.task.TrafficAnalyticsAggregationTask;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.SchedulingConfigurer;
import org.springframework.scheduling.config.ScheduledTaskRegistrar;

import java.io.IOException;

@Configuration
@EnableScheduling
public class ScheduleConfig implements SchedulingConfigurer {

    @Value("${xuan.task.cron}")
    private String cronExpression;

    @Autowired
    private TrafficAnalyticsAggregationTask trafficAnalyticsAggregationTask;

    @Override
    public void configureTasks(ScheduledTaskRegistrar taskRegistrar) {
        taskRegistrar.addCronTask(new Runnable() {
            @Override
            public void run() {
                // 这里编写你的定时任务逻辑
                try {
                    trafficAnalyticsAggregationTask.aggregateYesterdayData();
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
                // ...
            }
        }, cronExpression);
    }
}
