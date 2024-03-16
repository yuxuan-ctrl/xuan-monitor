import com.xuan.common.utils.IpUtil;
import org.junit.Test;
import org.junit.platform.commons.logging.Logger;
import org.junit.platform.commons.logging.LoggerFactory;
import org.springframework.boot.test.context.SpringBootTest;


@SpringBootTest
public class IpUtilTest {

    private static final Logger LOGGER = LoggerFactory.getLogger(IpUtilTest.class);

    /**
     * 测试 ip 所属地址
     */
    @Test
    public void testGetIpRegion() {
        String ip = "172.18.192.1"; // IpRegion:上海
//        String ip = "47.52.236.180"; // IpRegion:香港
//        String ip = "172.22.12.123"; // IpRegion:内网IP
//        String ip = "164.114.53.60"; // IpRegion:美国
        String ipRegion = IpUtil.getIpRegion(ip);
        System.out.println(ipRegion);
    }
}
