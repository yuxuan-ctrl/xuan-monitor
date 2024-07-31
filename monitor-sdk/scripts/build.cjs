/*
 * @Author: yuxuan-ctrl 
 * @Date: 2024-07-31 17:08:21
 * @LastEditors: yuxuan-ctrl 
 * @LastEditTime: 2024-07-31 17:21:56
 * @FilePath: \monitor-sdk\scripts\build.cjs
 * @Description: 
 * 
 * Copyright (c) 2024 by ${git_name_email}, All Rights Reserved. 
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const packageJsonPath = path.resolve('package.json');
const distFolderPath = path.resolve('dist');
const libFolderPath = path.resolve('lib');

// 删除已存在的 lib 文件夹
if (fs.existsSync(libFolderPath)) {
    console.log('Removing existing lib folder...');
    fs.rmSync(libFolderPath, { recursive: true, force: true });
}

// 执行 npm run build
console.log('Building project...');
execSync('npm run build', { stdio: 'inherit' });

// 创建 lib 文件夹
console.log('Creating lib folder...');
fs.mkdirSync(libFolderPath, { recursive: true });

// 复制 package.json 到 lib 文件夹
console.log('Copying package.json to lib folder...');
fs.copyFileSync(packageJsonPath, path.join(libFolderPath, 'package.json'));

// 复制 dist 文件夹到 lib 文件夹
console.log('Copying dist folder to lib folder...');
fs.cpSync(distFolderPath, libFolderPath, { recursive: true });

console.log('Build process completed.');