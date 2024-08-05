#!/bin/bash

# 指定 JAR 文件的路径
JAR_FILE=/data/apps/front-insight/front-insight-server.jar

# 指定配置文件的路径
CONFIG_FILE=/data/apps/front-insight/config/application.yml

# 指定日志文件的路径
LOG_FILE=/data/apps/front-insight/logs/current.log

# 创建日志文件目录（如果不存在）
mkdir -p $(dirname "$LOG_FILE")

# 创建备份目录（如果不存在）
BACKUP_DIR=$(dirname "$0")/bak
mkdir -p "$BACKUP_DIR"

# 服务名
SERVICE_NAME=front-insight

# 获取当前时间戳
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# JAR 文件备份文件名
BACKUP_JAR_FILE="$BACKUP_DIR/$SERVICE_NAME-$TIMESTAMP.jar"

# 检查是否存在正在运行的进程
PID=$(pgrep -f "$JAR_FILE")

# 如果进程存在，则停止进程
if [ -n "$PID" ]; then
  echo "Stopping existing process with PID: $PID"
  kill -9 "$PID"
  sleep 2 # 等待一段时间确保进程已完全停止
fi

# 备份 JAR 文件
if [ -f "$JAR_FILE" ]; then
  echo "Backing up JAR file to $BACKUP_JAR_FILE"
  cp "$JAR_FILE" "$BACKUP_JAR_FILE"
fi

# 使用 nohup 在后台启动 Java 应用程序，并将日志输出到 LOG_FILE
echo "Starting application..."
nohup java -Dspring.config.location=file:$CONFIG_FILE -jar $JAR_FILE > "$LOG_FILE" 2>&1 &

# 等待一段时间确保应用启动
sleep 2

# 使用 tail -f 实时查看日志
echo "Application started. Now tailing the log file: $LOG_FILE"
tail -f "$LOG_FILE"