简体中文 | [English](./README.en.md) 

# Photoshop 图层名称导出 / 导入

这是一个用于 Photoshop 的脚本工具，适合做图层命名批量翻译、重命名和跨语言处理。

- 导出脚本：`Export_PSD_Layer_Names_To_CSV.jsx`
- 导入脚本：`Import_PSD_Layer_Names_From_CSV.jsx`

工作流是：

1. 在 Photoshop 中导出当前 PSD 的所有图层 / 图层组名称到 CSV
2. 在 Excel / Numbers / 文本编辑器中修改 `new_name` 列
3. 再运行导入脚本，把新名称回写到原始 PSD 中

---

## 功能说明

### 1. 导出图层名称

运行 `Export_PSD_Layer_Names_To_CSV.jsx` 后，脚本会扫描当前 PSD 中的所有图层和图层组，并生成一个 CSV 文件。

导出内容包括：

- `layer_id`：图层唯一 ID
- `level`：层级深度
- `type`：`LAYER` 或 `GROUP`
- `path`：图层路径（按父子层级拼接）
- `original_name`：原始名称
- `new_name`：默认与原始名称一致，适合后续翻译或重命名

脚本会输出 UTF-8 BOM 编码，方便 Windows Excel 正确识别中文、日文等字符。

### 2. 导入图层名称

运行 `Import_PSD_Layer_Names_From_CSV.jsx`，选择刚才导出的 CSV 文件后，脚本会读取 `new_name` 列，并按 `layer_id` 去匹配当前 PSD 中对应的图层 / 图层组。

导入规则：

- 只读取 `new_name` 列
- 仅按 `layer_id` 定位图层，不依赖名称文本匹配
- `new_name` 为空时跳过
- 找不到匹配图层时记录为缺失项

---

## 使用方法

### 导出步骤

1. 打开要处理的 PSD 文件
2. 在 Photoshop 顶部菜单中选择：
   `文件` → `脚本` → `浏览...`
3. 选择 `Export_PSD_Layer_Names_To_CSV.jsx`
4. 选择导出位置并保存 CSV
5. 用 Excel 打开 CSV 文件
6. 只修改最后一列 `new_name`
7. 保存为 `CSV UTF-8` 格式

> 注意：不要修改 `layer_id`，也不要删除表头。否则导入脚本无法正确匹配图层。

### 导入步骤

1. 打开需要重命名的 PSD 文件
2. 选择：
   `文件` → `脚本` → `浏览...`
3. 运行 `Import_PSD_Layer_Names_From_CSV.jsx`
4. 选择处理后的 CSV 文件
5. 脚本会自动按 `layer_id` 批量重命名图层和图层组

---

## CSV 示例

```csv
layer_id,level,type,path,original_name,new_name
1,0,LAYER,背景,背景,Background
2,0,GROUP,UI,UI,界面
3,1,LAYER,UI/标题,标题,Title
```

你可以：

- 把 `new_name` 改成英文、日文、繁体中文等
- 只翻译最后一列
- 保持其它列不动

---

## 使用注意事项

- 最佳实践是：在同一个 PSD 文件或副本上执行导入脚本
- 如果图层结构发生了大改动，`layer_id` 可能不再对应原图层
- 只有 `new_name` 列是需要修改的内容，其他列用于定位
- 空白的 `new_name` 会被跳过，不会覆盖原名称
- 脚本不会处理图层样式、智能对象内容等额外属性，只会重命名图层 / 图层组

---

## 适用场景

- 批量翻译图层名称
- 为设计稿整理标准命名规则
- 将 PSD 中的命名统一成中英混排或英文命名
- 配合团队协作完成图层命名修改

---

## 目录说明

```text
PhotopshopExportImportLayerName/
├── Export_PSD_Layer_Names_To_CSV.jsx   # 导出图层名称
├── Import_PSD_Layer_Names_From_CSV.jsx # 导入重命名结果
├── README.md                           # 使用说明
└── 生成的 CSV 文件                     # 处理过程中的中间文件
```

---

## 推荐工作流

```text
PSD 文件
  ↓
导出 CSV
  ↓
Excel 修改 new_name
  ↓
保存 UTF-8 CSV
  ↓
导入脚本回写命名
  ↓
完成图层名称更新
```

如果你希望，我还可以继续把这个 README 再升级成一个更正式的项目文档版，增加“功能概览 / 版本说明 / 常见问题”章节。
