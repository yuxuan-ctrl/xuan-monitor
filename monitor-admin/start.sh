#!/bin/bash

# 指定 JAR 文件的路径
JAR_FILE=/data/apps/front-insight/front-insight-server.jar

# 指定配置文件的路径
CONFIG_FILE=/data/apps/front-insight/config/application.yml

# 指定日志文件的路径
LOG_FILE=/data/apps/front-insight/logs/current.log

# 创建日志文件目录（如果不存在）
mkdir -p $(dirname "$LOG_FILE")

# 使用 nohup 在后台启动 Java 应用程序，并将日志输出到 LOG_FILE
nohup java -Dspring.config.location=file:$CONFIG_FILE -jar $JAR_FILE > "$LOG_FILE" 2>&1 &