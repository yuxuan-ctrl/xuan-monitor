package com.xuan.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@RestController
public class TestController {
    @GetMapping("/redirectTo")
    void testRedirect(HttpServletResponse response) throws IOException {
//        String testUrl = "https://www.baidu.com";
        String testUrl2 = "http://localhost:3000/login";
        response.sendRedirect(testUrl2);

    }

    @PostMapping(value = "/redirectToPost")
    void testRedirectPost(HttpServletResponse response) throws IOException {
        String testUrl = "https://www.baidu.com";
//        String testUrl2 = "http://localhost:3000/login";
        response.sendRedirect(testUrl);
    }

    @GetMapping("/setCookieRedirect")
    void testCookieRedirect(HttpServletResponse response) throws IOException {
//        String testUrl = "http://localhost:3000/login";
//        String testUrl = "http://testxuan.com:3333/login";
        String testUrl = "http://baidu.com";
        Cookie cookie = new Cookie("BA_HECTOR","test");
        cookie.setDomain("baidu.com");
        cookie.setMaxAge(43200);
        cookie.setSecure(false);
        cookie.setHttpOnly(false);

//        cookie.setDomain("localhost");
        response.addCookie(cookie);
        response.sendRedirect(testUrl);
    }
}
