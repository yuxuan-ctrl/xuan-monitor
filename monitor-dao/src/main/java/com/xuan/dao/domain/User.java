package com.xuan.dao.domain;

public class User {
    String user_name;
    String pass_word;
    String system_ids;
    String token;
    String usertoken;
    Integer is_use;
    Integer level;
    String create_time;

    public User() {
    }

    public User(String user_name, String pass_word, String system_ids, String token, String usertoken, Integer is_use, Integer level, String create_time) {
        this.user_name = user_name;
        this.pass_word = pass_word;
        this.system_ids = system_ids;
        this.token = token;
        this.usertoken = usertoken;
        this.is_use = is_use;
        this.level = level;
        this.create_time = create_time;
    }

    /**
     * 获取
     * @return user_name
     */
    public String getUser_name() {
        return user_name;
    }

    /**
     * 设置
     * @param user_name
     */
    public void setUser_name(String user_name) {
        this.user_name = user_name;
    }

    /**
     * 获取
     * @return pass_word
     */
    public String getPass_word() {
        return pass_word;
    }

    /**
     * 设置
     * @param pass_word
     */
    public void setPass_word(String pass_word) {
        this.pass_word = pass_word;
    }

    /**
     * 获取
     * @return system_ids
     */
    public String getSystem_ids() {
        return system_ids;
    }

    /**
     * 设置
     * @param system_ids
     */
    public void setSystem_ids(String system_ids) {
        this.system_ids = system_ids;
    }

    /**
     * 获取
     * @return token
     */
    public String getToken() {
        return token;
    }

    /**
     * 设置
     * @param token
     */
    public void setToken(String token) {
        this.token = token;
    }

    /**
     * 获取
     * @return usertoken
     */
    public String getUsertoken() {
        return usertoken;
    }

    /**
     * 设置
     * @param usertoken
     */
    public void setUsertoken(String usertoken) {
        this.usertoken = usertoken;
    }

    /**
     * 获取
     * @return is_use
     */
    public Integer getIs_use() {
        return is_use;
    }

    /**
     * 设置
     * @param is_use
     */
    public void setIs_use(Integer is_use) {
        this.is_use = is_use;
    }

    /**
     * 获取
     * @return level
     */
    public Integer getLevel() {
        return level;
    }

    /**
     * 设置
     * @param level
     */
    public void setLevel(Integer level) {
        this.level = level;
    }

    /**
     * 获取
     * @return create_time
     */
    public String getCreate_time() {
        return create_time;
    }

    /**
     * 设置
     * @param create_time
     */
    public void setCreate_time(String create_time) {
        this.create_time = create_time;
    }

    public String toString() {
        return "User{user_name = " + user_name + ", pass_word = " + pass_word + ", system_ids = " + system_ids + ", token = " + token + ", usertoken = " + usertoken + ", is_use = " + is_use + ", level = " + level + ", create_time = " + create_time + "}";
    }
}
