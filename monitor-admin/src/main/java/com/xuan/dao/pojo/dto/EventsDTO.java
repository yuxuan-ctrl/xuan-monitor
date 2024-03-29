package com.xuan.dao.pojo.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.xuan.dao.model.Location;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.geo.Point;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class  EventsDTO {
    @JsonProperty("appId")
    String appId;

    @JsonProperty("userId")
    String userId;
    @JsonProperty("userAgent")
    private String userAgent;

    @JsonProperty("platform")
    String platform;

    @JsonProperty("location")
    Location location;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Timestamp timestamp;;

    @JsonProperty("eventList")
    List<Map<String, Object>> eventList;

    @JsonProperty("actionList")
    private List<Map<String, Object>> actionList;

    List<String> record;

}
