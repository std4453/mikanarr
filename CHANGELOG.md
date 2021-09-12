# Changelog

All notable changes to this project will be documented in this file.

对本项目所有值得注意的更改均会在本文件中记录。

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

格式基于 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.0.0/)，且本项目遵循 [语义化版本](https://semver.org/lang/zh-CN/)。

## [1.0.1] - 2020-09-12

### Added 新增

- 发布的 Docker Image 携带版本号
- 添加 `CHANGELOG.md`
- `README.md` 中添加 Circle CI 构建状态徽章

### Changed 更改

- 移除 `build_docker.sh`，直接在 `.circleci/config.yml` 中构建
- `package.json` 中添加 `private: true`

### Removed 移除

- `README.md` 中移除 `cnpm` 的部分
