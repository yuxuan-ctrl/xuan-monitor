import co.elastic.clients.elasticsearch.ElasticsearchClient;
import co.elastic.clients.elasticsearch.indices.DeleteIndexResponse;
import co.elastic.clients.elasticsearch.indices.GetIndexResponse;
import co.elastic.clients.transport.endpoints.BooleanResponse;
import com.xuan.MonitorApplication;
import com.xuan.configuration.ESClientConfig;
import co.elastic.clients.elasticsearch.indices.CreateIndexResponse;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.IOException;

@SpringBootTest(classes = {MonitorApplication.class, ESClientConfig.class}) // 替换 YourSpringBootApp 为你实际的 Spring Boot 主配置类
@RunWith(SpringRunner.class)
public class ESClientTest {

    @Autowired
    private ElasticsearchClient client;

    @Test
    public void createIndex() throws IOException {

        CreateIndexResponse products = client.indices().create(c -> c.index("errors"));
        System.out.println(products.acknowledged());
    }


    /**
     * 查询创建的索引
     */
    @Test
    public void queryIndex() throws IOException {
        GetIndexResponse getIndexResponse = client.indices().get(c->c.index("uservo"));
        System.out.println(getIndexResponse);
    }

    /**
     * 判断索引是否存在
     *
     */
    @Test
    public void indexExi() throws IOException {
        BooleanResponse exists = client.indices().exists(e -> e.index("uservo"));
        System.out.println(exists.value());

    }

    /**
     * 删除索引
     */
    @Test
    public void deleteIndex() throws IOException{
        DeleteIndexResponse deleteIndexResponse = client.indices().delete(c->c.index("uservo"));
        System.out.println(deleteIndexResponse.acknowledged());
    }
}