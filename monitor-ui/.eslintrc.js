/*
 * @Author: yuxuan-ctrl 
 * @Date: 2024-02-19 16:43:07
 * @LastEditors: yuxuan-ctrl 
 * @LastEditTime: 2024-02-19 16:43:24
 * @FilePath: \monitor-ui\.eslintrc.js
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
 */
module.exports = {
    // 其他规则配置...

    "rules": {
      // 关闭"import/first"规则
      "import/first": "off"
    },
  
    // 或者，在overrides字段里针对特定文件夹或文件进行忽略
    "overrides": [
      {
        "files": ["src/services/sdk/*.js"],
        "rules": {
          "import/first": "off"
        }
      }
    ]
  };