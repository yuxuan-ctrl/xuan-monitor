package com.xuan.configuration;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "spring.datastore")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class DatastoreProperties {

    private String type;
}
