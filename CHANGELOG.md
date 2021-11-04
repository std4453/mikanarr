# Changelog

All notable changes to this project will be documented in this file.

对本项目所有值得注意的更改均会在本文件中记录。

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，且本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [1.1.1] - 2021.11.04

### Changed 更改

- 调用 Sonarr API 的接口也需要鉴权

## [1.1.0] - 2021-11-04

### Added 新增

- 列表页全文搜索
- 季度使用 Sonarr 数据提供下拉选择，并展示监控状态
- 条目中添加 Mikan Anime RSS 推送地址，侧边栏内容与之联动
- 添加按钮一键复制条目对应的本地 RSS 推送地址
- 实时高亮显示匹配命中的标题
- 基于 JWT 的简单用户认证

### Changed 更改

- 列表页默认根据创建顺序降序排列
- 列表页分页数量改为 30、50、100
- 侧边栏地址点击即可直接讲标题填入表单

## [1.0.1] - 2021-09-12

### Added 新增

- 发布的 Docker Image 携带版本号
- 添加 `CHANGELOG.md`
- `README.md` 中添加 Circle CI 构建状态徽章

### Changed 更改

- 移除 `build_docker.sh`，直接在 `.circleci/config.yml` 中构建
- `package.json` 中添加 `private: true`

### Removed 移除

- `README.md` 中移除 `cnpm` 的部分
