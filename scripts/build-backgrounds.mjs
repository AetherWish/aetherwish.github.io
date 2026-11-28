#!/usr/bin/env node
/**
 * 扫描 img/bg/ 生成背景图库清单（img/bg/manifest.json）。
 * ---------------------------------------------------------------------------
 * GitHub Pages 不能列目录，所以浏览器只能读取预先写好的清单。
 * 本地往 img/bg/ 里加图后运行：
 *
 *     node scripts/build-backgrounds.mjs
 *
 * 再提交生成的 manifest.json。GitHub Actions 在部署前也会跑一次，保证
 * 直接 push 图片（忘记本地跑脚本）时清单同样是最新的。
 *
 * 已有清单里的 label 会被保留，方便手工改成好看的显示名；新图默认用
 * 文件名去掉扩展名、把下划线/连字符换成空格。
 */

import { readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BACKGROUND_DIR = join(ROOT, 'img', 'bg');
const MANIFEST_PATH = join(BACKGROUND_DIR, 'manifest.json');
const IMAGE_EXTENSION = /\.(?:avif|jpe?g|png|webp)$/i;

function defaultLabel(file) {
    return file
        .replace(IMAGE_EXTENSION, '')
        .replace(/[_-]+/g, ' ')
        .trim();
}

/** 读取旧清单里的自定义 label，按文件名建索引 */
async function readPreviousLabels() {
    const labels = new Map();

    try {
        const data = JSON.parse(await readFile(MANIFEST_PATH, 'utf8'));
        const items = Array.isArray(data) ? data : data.backgrounds;

        (items || []).forEach((item) => {
            if (
                item &&
                typeof item.file === 'string' &&
                typeof item.label === 'string' &&
                item.label.trim()
            ) {
                labels.set(item.file, item.label.trim());
            }
        });
    } catch (error) {
        // 首次运行或清单损坏时没有旧 label 可继承
    }

    return labels;
}

const entries = await readdir(BACKGROUND_DIR, { withFileTypes: true });
const files = entries
    .filter((entry) => entry.isFile() && IMAGE_EXTENSION.test(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));

const previousLabels = await readPreviousLabels();
const backgrounds = files.map((file) => ({
    file,
    label: previousLabels.get(file) || defaultLabel(file)
}));

const manifest = { backgrounds };
await writeFile(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n', 'utf8');

console.log(
    `[backgrounds] ${backgrounds.length} 张图片 → ${relative(ROOT, MANIFEST_PATH)}`
);
