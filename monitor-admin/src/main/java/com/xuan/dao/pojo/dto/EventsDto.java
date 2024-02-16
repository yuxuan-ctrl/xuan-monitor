package com.xuan.dao.pojo.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.xuan.dao.model.EventList;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class EventsDto {
    @JsonProperty("appId")
    String appId;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private Timestamp timestamp;;

    @JsonProperty("eventList")
    List<Map<String, Object>> eventList;

    @JsonProperty("actionList")
    private List<Map<String, Object>> actionList;

    List<String> record;

}
