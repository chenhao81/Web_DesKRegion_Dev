'''
-- 打包脚本 v0.0.1
-- @用法 在 build 目录执行 `python build.py` (需python 3.x)
--  dist目录会生成多个供部署的zip压缩包（如test、site、pro）
-- @author xiaowu @2017-12-07
'''
# -*- coding:utf-8 -*-
import sys
import os
import subprocess
import shutil
import time
from datetime import datetime

# 参数为 后台版本号
if len(sys.argv) > 1:
    systemVersion = 'v' + sys.argv[1]
else:
    # 输入 版本号
    systemVersion = 'v' + input("输入版本号： ")
    print("\n")
    print('[system@vue2.5.16 ~]# 版本：%s' % systemVersion)

startTime = datetime.now()

# 编译vue
buildStat = subprocess.call('node build/build.js', shell=True)

if buildStat != 0:
    print('vue 编译错误')
    sys.exit(1)

# 相对dist所在目录
DISTPATH = './dist/'


# index.html 注入版本号 <!-- v1.0.0 -->
indexHtmlPath = DISTPATH + 'index.html'
indexHtml = open(indexHtmlPath, 'r+', encoding='UTF-8')
indexHtml_lines = indexHtml.readlines()
indexHtml.seek(0)
indexHtml.truncate()
for line in indexHtml_lines:
    line = line.replace('systemVersion', systemVersion)
    indexHtml.write(line)
indexHtml.close()
print("系统版本号 %s 已写入 %s" % (systemVersion, indexHtmlPath[2:]))

# 创建临时文件夹
if os.path.exists(DISTPATH + '_site'):
    shutil.rmtree(DISTPATH + '_site')
if os.path.exists(DISTPATH + '_pro'):
    shutil.rmtree(DISTPATH + '_pro')

print('生成临时目录')
os.mkdir(DISTPATH + '_site')
os.mkdir(DISTPATH + '_pro')

# 拷贝资源
def copyAssets(name):
    filePath = DISTPATH + '_' + name
    os.mkdir(filePath + '/conf/')
    print('正在拷贝资源')
    shutil.copytree(DISTPATH + 'static/', filePath + '/static/')
    shutil.copyfile(DISTPATH + 'index.html', filePath + '/index.html')
    shutil.copyfile(DISTPATH + 'favicon.ico', filePath + '/favicon.ico')
    shutil.copyfile(DISTPATH + 'conf/index-' + name + '.js', filePath + '/conf/index.js')

# 打压缩包
def codeZip(name, zipName):
    print('正在压缩')
    shutil.make_archive(DISTPATH + zipName,'zip',root_dir = DISTPATH + '_' + name)   # 创建压缩文件
    shutil.rmtree(DISTPATH + '_' + name)

def startTask(name):
    print('开始生成 ' + name + ' 包')
    zipName = 'dist_' + name + '_' + systemVersion
    copyAssets(name)
    codeZip(name, zipName)
    print(name + ' 打包成功', zipName + '.zip')

# site环境包
startTask('site')
# 生产环境
startTask('pro')

endTime = datetime.now()
dtTime = (endTime - startTime).seconds

print('完成，用时 %d 秒！发包部署~~' % dtTime)
