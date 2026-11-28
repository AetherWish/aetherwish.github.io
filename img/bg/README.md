# 背景图库

`manifest.json` 由 `scripts/build-backgrounds.mjs` 扫描本目录生成，不要手工增删条目。

## 添加背景

1. 把图片放进本目录，支持 `.avif` / `.jpg` / `.jpeg` / `.png` / `.webp`。
2. 运行：

   ```bash
   node scripts/build-backgrounds.mjs
   ```

3. 提交图片与更新后的 `manifest.json`。

清单里的 `label` 只作为缩略图按钮的无障碍名称，不会显示在页面上。生成
脚本会保留已有条目的 `label`，所以可以在生成后手动把它改成更好读的名
称（例如 `PhiLia093`），下次运行不会被覆盖。

部署时 `.github/workflows/static.yml` 会在上传前自动跑一次脚本，即使
忘记在本地运行，线上清单也会包含新图。

## 命名

文件名会出现在页面资源路径里，建议只用字母、数字、下划线、连字符和
点，避免空格与 `#`、`?` 等需要转义的字符。
