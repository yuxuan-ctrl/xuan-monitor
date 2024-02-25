package com.xuan.service.impl;

import co.elastic.clients.elasticsearch.ElasticsearchAsyncClient;
import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch._types.Result;
import co.elastic.clients.elasticsearch._types.query_dsl.*;
import co.elastic.clients.elasticsearch.core.*;
import co.elastic.clients.elasticsearch.core.search.Hit;
import co.elastic.clients.json.JsonData;
import com.alibaba.fastjson.JSON;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.xuan.common.result.PageResult;
import com.xuan.common.utils.CalculateUtil;
import com.xuan.common.utils.DateFormatUtils;
import com.xuan.dao.mapper.UserMapper;
import com.xuan.dao.model.ESDocument;
import com.xuan.dao.model.EventList;
import com.xuan.dao.pojo.dto.MetricsDTO;
import com.xuan.dao.pojo.entity.Metrics;
import com.xuan.dao.pojo.entity.Users;
import com.xuan.service.ESDocumentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.StringReader;
import java.time.*;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.function.BiConsumer;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ESDocumentServiceImpl implements ESDocumentService {

    //同步客户端
    @Autowired
    private CalculateUtil calculateUtil;
    private final ElasticsearchClient elasticsearchClient;

    // 异步客户端
    private final ElasticsearchAsyncClient elasticsearchAsyncClient;

    @Value("${xuan.task.hoursBack:24}") // 默认值为24小时
    private int hoursBack;




    @Override
    public <T> IndexResponse createByFluentDSL(String idxName, String idxId, T document) throws Exception {
        return elasticsearchClient.index(idx -> idx
                .index(idxName)
                .id(idxId)
                .document(document));
    }

    /**
     * BuilderPattern 方式创建文档
     * @param idxName 索引名
     * @param idxId 索引id
     * @param document 文档对象
     */
    @Override
    public <T> IndexResponse createByBuilderPattern(String idxName, String idxId, T  document) throws Exception {
        IndexRequest.Builder<Object> indexReqBuilder = new IndexRequest.Builder<>();
        indexReqBuilder.index(idxName);
        indexReqBuilder.id(idxId);
        indexReqBuilder.document(document);
        return elasticsearchClient.index(indexReqBuilder.build());
    }

    /**
     * json方式创建文档
     * @param idxName 索引名
     * @param idxId 索引id
     * @param jsonContent json字符串
     */
    @Override
    public IndexResponse createByJson(String idxName, String idxId, String jsonContent) throws Exception {
        return elasticsearchClient.index(i -> i
                .index(idxName)
                .id(idxId)
                .withJson(new StringReader(jsonContent))
        );
    }

    /**
     *  异步方式创建文档
     * @param idxName 索引名
     * @param idxId 索引id
     * @param document 文档
     * @param action 操作
     */
    @Override
    public <T> void createAsync(String idxName, String idxId, T document, BiConsumer<IndexResponse, Throwable> action) {
        elasticsearchAsyncClient.index(idx -> idx
                .index(idxName)
                .id(idxId)
                .document(document)
        ).whenComplete(action);
    }

    /**
     * 批量方式创建文档
     * @param idxName 索引名
     * @param documents 要增加的对象集合
     */
    @Override
    public <T> BulkResponse bulkCreate(String idxName, List<T> documents) throws Exception {
        BulkRequest.Builder br = new BulkRequest.Builder();
        documents.forEach(document ->{
            ESDocument esDocument = (ESDocument) document;
            br.operations(op -> op.index(idx -> idx
                    .index(idxName)
                    .id(esDocument.getId().toString())
                    .document(esDocument)));
        });
        return elasticsearchClient.bulk(br.build());
    }

    /**
     *
     * @param idxName 索引名称
     * @param docId 文档id
     * @param tClass 返回的类型
     * @param map 修改内容的map
     * Map<String, Object> map = new HashMap<>();
     *         map.put("age", 35);
     * 把年龄改成35
     */
    @Override
    public <T> Result updateById(String idxName, String docId, Class<T> tClass, Map<String,Object> map) throws IOException {
        UpdateResponse<T> response = elasticsearchClient.update(e -> e.index(idxName).id(docId).doc(map), tClass);
        return response.result();
    }

    /**
     * 文档id查询信息
     * @param idxName 索引名
     * @param docId 文档id
     */
    @Override
    public <T> T getById(String idxName, String docId,Class<T> tClass) throws IOException {
        GetResponse<T> response = elasticsearchClient.get(g -> g
                        .index(idxName)
                        .id(docId),
                tClass);
        return response.found() ? response.source() : null;
    }


    /**
     * 根据索引名称和文档id查询ObjectNode
     * @param idxName 索引名
     * @param docId 文档id
     */
    @Override
    public ObjectNode getObjectNodeById(String idxName, String docId) throws IOException {
        GetResponse<ObjectNode> response = elasticsearchClient.get(g -> g
                        .index(idxName)
                        .id(docId),
                ObjectNode.class);

        return response.found() ? response.source() : null;
    }

    /**
     * 单条输出
     * @param idxName 索引名
     * @param docId 文档id
     */
    @Override
    public Boolean deleteById(String idxName, String docId) throws IOException {
        DeleteResponse delete = elasticsearchClient.delete(d -> d
                .index(idxName)
                .id(docId));
        return delete.forcedRefresh();
    }

    /**
     * 批量删除
     * @param idxName 索引名
     * @param docIds 要删除的文档id集合
     */
    @Override
    public BulkResponse bulkDeleteByIds(String idxName, List<String> docIds) throws Exception {
        BulkRequest.Builder br = new BulkRequest.Builder();
        // 将每一个对象都放入builder中
        docIds.forEach(id -> br
                .operations(op -> op
                        .delete(d -> d
                                .index(idxName)
                                .id(id))));
        return elasticsearchClient.bulk(br.build());
    }

    /**
     * 查询今天某个索引表的所有数据
     * @param idxName 索引名
     * @param dateFieldName 日期字段名，假设这个字段是日期类型且存储的是文档创建日期
     * @param tClass 返回结果的类型
     * @return 符合条件的文档列表
     * @throws IOException
     */
    @Override
    public <T> List<T> searchTodayData(String idxName, String dateFieldName, long fromTimestamp, long toTimestamp, Class<T> tClass) throws IOException {
        LocalDate today = LocalDate.now(ZoneOffset.UTC);
//        String todayStart = today.atStartOfDay().format(DateTimeFormatter.ISO_INSTANT);

        SearchRequest request = new SearchRequest.Builder()
                .index(idxName)
                .query(q -> q
                        .range(r -> r
                                        .field(dateFieldName)
                                        .gte(JsonData.fromJson(String.valueOf(fromTimestamp)))
                                        .lt(JsonData.fromJson(String.valueOf(toTimestamp)))
                        )
                )
                .build();

        SearchResponse<T> response = elasticsearchClient.search(request, tClass);

        return response.hits().hits().stream()
                .map(hit -> hit.source())
                .collect(Collectors.toList());
    }

    @Override
    public <T> List<T> queryAll(String idxName, String dateFieldName ,Class<T> tClass) throws IOException {

        SearchRequest request = new SearchRequest.Builder()
                .index(idxName)
                .query(q -> q
                        .range(r -> r
                                .field(dateFieldName)
                        )
                )
                .build();

        SearchResponse<T> response = elasticsearchClient.search(request, tClass);

        return response.hits().hits().stream()
                .map(hit -> hit.source())
                .collect(Collectors.toList());
    }

    @Override
    public <T> PageResult<T> queryByPage(String idxName, String dateFieldName, Class<T> tClass, int pageIndex, int pageSize) throws IOException {
        // 计算分页偏移量（从0开始计数）
        int from = pageIndex * pageSize;

        SearchRequest request = new SearchRequest.Builder()
                .index(idxName)
                .query(q -> q
                        .range(r -> r.field(dateFieldName)
                                .from(String.valueOf(from))
                                )
                )
//                .from(from)
                .from(from)
                .size(pageSize)
                .build();

        SearchResponse<T> response = elasticsearchClient.search(request, tClass);

        long total = response.hits().total().value();
        List<T> records = response.hits().hits().stream()
                .map(hit -> hit.source())
                .collect(Collectors.toList());

        return new PageResult<T>(total, records,pageSize ,pageIndex);
    }

    private <T> SearchRequest createSearchRequest(String idxName, String dateFieldName, Instant startTime, Instant endTime, String appId,int size,String scrollId,String userId) {
        BoolQuery.Builder boolQueryBuilder = new BoolQuery.Builder();

        if (startTime != null && endTime != null) {
            Query rangeQuery = QueryBuilders.range()
                    .field(dateFieldName)
                    .gte(JsonData.of(startTime.toEpochMilli()))
                    .lte(JsonData.of(endTime.toEpochMilli()))
                    .build()._toQuery();
            boolQueryBuilder.must(rangeQuery);
        }

        if (appId != null && !appId.isEmpty()) {
            Query termQuery = QueryBuilders.term()
                    .field("appId")
                    .value(appId)
                    .build()._toQuery();
            boolQueryBuilder.filter(termQuery);
        }

        if (userId != null && !userId.isEmpty()) {
            Query termQuery = QueryBuilders.term()
                    .field("userId")
                    .value(userId)
                    .build()._toQuery();
            boolQueryBuilder.filter(termQuery);
        }

        BoolQuery boolQuery = boolQueryBuilder.build();
        return new SearchRequest.Builder()
                .index(idxName)
                .size(size)
                .query(boolQuery._toQuery())
                .scroll(builder -> builder.time(scrollId))
                .build();
}

    public <T> List<T> queryPastHours(String idxName, String dateFieldName, Class<T> tClass, MetricsDTO metricsDTO) throws IOException {
        Instant startTime = metricsDTO.getStartTimeOrDefault(Instant.now().minus(hoursBack, ChronoUnit.HOURS));
        Instant endTime = metricsDTO.getEndTimeOrDefault(Instant.now());

        SearchRequest request = createSearchRequest(idxName, dateFieldName, startTime, endTime, metricsDTO.getAppIdOrDefault(),10,"5s",metricsDTO.getUserIdOrDefault());
        System.out.println(request);
        SearchResponse<T> response = elasticsearchClient.search(request, tClass);

        List<T> allList = new ArrayList<>( response.hits().hits().stream()
                .map(hit -> hit.source())
                .collect(Collectors.toList()));

        String scrollId = response.scrollId();
        ScrollResponse<T> scrollResponse = null;
        do {

            String finalScrollId = scrollId;
            scrollResponse = elasticsearchClient.scroll(s -> s.scrollId(finalScrollId).scroll(t -> t.time("5s")), tClass);
            allList.addAll(scrollResponse.hits().hits().stream().map(hit->hit.source()).collect(Collectors.toList()));
            scrollId =scrollResponse.scrollId();
        }while (!scrollResponse.hits().hits().isEmpty());

        String finalScrollId1 = scrollId;
        ClearScrollRequest clearScrollRequest = ClearScrollRequest.of(builder -> builder.scrollId(String.valueOf(finalScrollId1)));
        ClearScrollResponse clearResponse = elasticsearchClient.clearScroll(clearScrollRequest);

        return allList;
    }

    public Metrics aggregateData(String events, String timestamp, Class<EventList> eventListClass, MetricsDTO metricsDTO) throws IOException {
        List<EventList> eventList = this.queryPastHours("events", "timestamp", EventList.class,metricsDTO);
        if(!eventList.isEmpty()){
            Metrics metrics = calculateUtil.calculateMetrics(eventList);
            LocalDate date = LocalDate.ofInstant(eventList.get(eventList.size()-1).getTimestamp().toInstant(), ZoneId.systemDefault()).minusDays(1); // 假设timestamp是前一天的
            metrics.setDate(DateFormatUtils.format(date.atStartOfDay()));
            return metrics;
        }
        return null;
    }


    public void ensureIndexExists(String... indices) throws IOException {
        for (String index : indices) {
            if (!elasticsearchClient.indices().exists(e -> e.index(index)).value()) {
                elasticsearchClient.indices().create(c -> c.index(index));
            }
        }
    }
}
