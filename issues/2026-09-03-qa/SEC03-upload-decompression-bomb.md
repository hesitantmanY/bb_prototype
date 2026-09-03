# SEC03 — docx/xlsx 只查上传字节,解压放大可打爆内存

严重度:中 / 方向:安全 / 确认度:读码可证

## 问题

上传解析端点(docx/xlsx)只按**输入字节**设上限,不查压缩包解压后的体积:

- docx:读 zip 内 `word/document.xml` 后 `ET.parse` 全量建 DOM,无对 zip 成员 `file_size` 的累计检查;
- xlsx:openpyxl/pandas 同样全量解压,随后 `to_dict()` + JSON 序列化返回,行数/单元格无上限。

XML 是文本,压缩率可到数百上千比一:5MB 上传理论上可解出 GB 级 XML,`ET.parse` 在内存建全量 DOM → 本地服务内存耗尽/进程卡死,所有 /api 端点连带瘫痪。

## 期望

解析前累计校验 zip 成员解压后大小与 XML 解压上限;xlsx 走流式(read_only)并对行数/单元格/返回结果设限。

## 复现

1. 构造高重复文本的 docx(document.xml 50MB+,打包后 <5MB);
2. 前端「文档提取」上传该文件;
3. 服务内存飙升直至卡死。

## 证据

- server/app.py:245 / :261 — 上限按输入字节
- server/doc_extract.py:30-43 — zipfile 读后 ET.parse 全量 DOM
- server/excel_parser.py:41,54-66 — 无解压上限,全量 to_dict
- server/test_security.py 的 test_upload_size_limits — 只测字节上限

## 修复方向

解析入口先遍历 zip 成员累计 file_size(超限拒绝),XML 解析前校验成员大小;xlsx 用 read_only + 行数/单元格/结果数上限。
