# Ant Design Pro

This project is initialized with [Ant Design Pro](https://pro.ant.design). Follow is the quick guide for how to use.

## Environment Prepare

Install `node_modules`:

```bash
npm install
```

or

```bash
yarn
```

## Provided Scripts

Ant Design Pro provides some useful script to help you quick start and build with web project, code style check and test.

Scripts provided in `package.json`. It's safe to modify or add additional script:

### Start project

```bash
npm start
```

### Build project

```bash
npm run build
```

### Check code style

```bash
npm run lint
```

You can also use script to auto fix some lint error:

```bash
npm run lint:fix
```

### Test code

```bash
npm test
```

## More

You can view full document on our [official website](https://pro.ant.design). And welcome any feedback in our [github](https://github.com/ant-design/ant-design-pro).

将 ClickHouse 与 PostgreSQL 集成，可以应用于以下场景：

实时数据分析：我们可以将 ClickHouse 用于实时数据处理和分析，而 PostgreSQL 用于存储和管理历史数据。
数据仓库：我们可以将 ClickHouse 用于数据仓库，将实时数据同步到 PostgreSQL 中，以便进行历史数据分析。
实时监控：我们可以将 ClickHouse 用于实时监控，例如用于监控网站访问量、应用性能等。

假设我们有一个大型网站应用，每天产生大量的用户活动数据，包括页面浏览、点击事件、用户会话数据等。同时，我们也需要对这些数据进行实时监控和分析，以及长期的历史数据挖掘。

1.实时数据处理与监控：
我们首先使用ClickHouse收集实时的用户行为数据，利用其强大的列式存储和并行计算能力，构建实时的监控面板，比如每秒请求数、活跃用户数、特定功能的使用频率等关键业务指标。
在应用程序中，每当有新的用户行为事件发生时，我们会立即将其写入到ClickHouse集群中。

2.数据同步至PostgreSQL：
定期或在满足特定条件时（例如每小时或每日），通过数据管道（如Kafka或Flink）或定时任务（如Cron Job）将ClickHouse中的汇总数据或重要原始数据同步至PostgreSQL。
或者，开发一个自定义的ETL过程，从ClickHouse中读取数据并通过COPY命令导入到PostgreSQL。

3.历史数据分析：
PostgreSQL用于存储经过筛选和转换后的长期历史数据，可以基于此进行复杂的数据分析和报告生成，例如用户留存率、转化漏斗分析、用户生命周期价值（LTV）等。
