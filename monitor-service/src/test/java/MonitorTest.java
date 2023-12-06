import com.xuan.properties.JwtProperties;
import com.xuan.utils.JwtUtil;
import io.jsonwebtoken.Claims;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;

import java.nio.charset.StandardCharsets;

@Slf4j
public class MonitorTest {

    public static void main(String[] args) {
        String token ="eyJraWQiOiIyMDIzMDUwNiIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJ1c2VyIiwiYXVkIjoibXlfY2xpZW50IiwibmJmIjoxNjk4NjI3NjkwLCJzdWJfdHlwZSI6IkhVTUFOIiwic2NvcGUiOlsib3JnIiwib3BlbmlkIiwicm9sZXMiLCJwcm9maWxlIl0sInJvbGVzIjoiYWRtaW4sdXNlciIsImlzcyI6Imh0dHA6Ly93d3cuZGcuY29tOjE4MDg5IiwiY2hpbmVzZU5hbWUiOiIlRTQlQjglODAlRTQlQjglQUElRTclOTQlQTglRTYlODglQjciLCJleHAiOjE2OTg3MTQ2OTAsImlhdCI6MTY5ODYyODI5MCwiZW1haWwiOiIyMjIyQHNoc25jLmNvbSJ9.Vn9_Zk8fTu_nyffLgyoQI1TGaciEd1tASyNmG242jqE__coXbBEYSa4KsD74FF0tywY_1OefeFZWANGlJ2KZtuQ5dL4bN6wN5wzxBKVk4fN3QaFGEt3piqeUTxAUXPJYcIctl_-QUxoKs_H8wu08asLMjIzc7BNwjbZD3OHPKJn7ugyOBwWiX_D9HMFqkUrVzR3kFVviPn8G9Nct33yXc5to21wU9bQtdLPt9TDDxT-o_ZNd4HwyncByh8XmULnUNqSHgYudOibEAvKq5-e26GQOwTa-BvGHHAMKGySLK2FGfCPXSd4HHKm9UAfsG1YOxohBk9VFA3NDRdbRvme1KQ";
        String key = "xuanmonitorabc";
        Claims claims = JwtUtil.parseJWT(key,token );
        log.info("claims：{}",claims);
    }
}


