/*
 * @Author: yuxuan-ctrl 
 * @Date: 2024-02-05 17:09:13
 * @LastEditors: yuxuan-ctrl 
 * @LastEditTime: 2024-02-05 17:15:35
 * @FilePath: \monitor-sdk\src\utils\calculate.ts
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
 */

export function normalizeUrlForPath(url) {
    // Vue Router在前端处理哈希模式时，实际路由信息位于#后面
    const hashIndex = url.indexOf('#');
    let pathPart;
  
    if (hashIndex !== -1) {
      // 哈希模式下，提取#之后的内容作为路径
      pathPart = url.substring(hashIndex + 1);
    } else {
      // 历史模式或其他情况，直接使用pathname
      const parser = new URL(url);
      pathPart = parser.pathname;
    }
  
    // 将路径分割为段落，并规范化动态ID
    // 这里假设动态ID由数字、字母和下划线组成
    const dynamicIdPattern = /^[0-9_]+$/;
    const pathSegments = pathPart.split('/');
    const normalizedPathSegments = pathSegments.map((segment) => {
      return dynamicIdPattern.test(segment) ? ':id' : segment;
    });
  
    // 重新组合规范化后的路径（去除末尾的"/"）
    const normalizedPath = `${normalizedPathSegments.join('/')}`.replace(/\/$/, '');
  
    return normalizedPath;
  }
