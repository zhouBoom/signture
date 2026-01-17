import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 定义要处理的文件列表
const files = [
    './index.html',
    './vite.config.js',
    './package.json',
    './src/styles/main.css',
    './src/pages/index.html'
];

// 读取所有文件并生成输出
let output = '';

files.forEach(filePath => {
    try {
        const absolutePath = path.resolve(__dirname, filePath);
        const content = fs.readFileSync(absolutePath, 'utf8');

        // 转换路径格式
        const normalizedPath = filePath.replace('./', '/testbed/project-folder/');

        // 创建JSON对象
        const jsonObj = {
            content: content,
            file_path: normalizedPath
        };

        // 添加到输出
        output += `${normalizedPath}\n`;
        output += JSON.stringify(jsonObj, null, 2) + '\n\n';

        console.log(`✓ 已处理: ${filePath}`);
    } catch (error) {
        console.error(`✗ 处理失败 ${filePath}:`, error.message);
    }
});

// 写入输出文件
const outputPath = path.resolve(__dirname, 'project-files-export.txt');
fs.writeFileSync(outputPath, output, 'utf8');

console.log(`\n✅ 所有文件已导出到: ${outputPath}`);
console.log(`📊 总共处理了 ${files.length} 个文件`);
