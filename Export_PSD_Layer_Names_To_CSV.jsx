#target photoshop
app.bringToFront();

/*
  Export_PSD_Layer_Names_To_CSV.jsx
  用途：将当前 PSD 的所有图层 / 图层组名称导出到 CSV。
  编码：UTF-8 with BOM，方便 Excel 识别中文 / 日文。
  翻译时：只修改最后一列 new_name。

  CSV columns:
  layer_id,level,type,path,original_name,new_name
*/

(function () {
    if (app.documents.length === 0) {
        alert("请先打开一个 PSD 文件。");
        return;
    }

    var doc = app.activeDocument;
    var defaultName = safeFileName(removeExtension(doc.name)) + "_layer_names.csv";
    var outFile = File.saveDialog("保存图层名称 CSV", "CSV:*.csv");

    if (!outFile) return;

    // 如果用户没有输入扩展名，自动补 .csv
    if (!/\.csv$/i.test(outFile.name)) {
        outFile = new File(outFile.fsName + ".csv");
    }

    outFile.encoding = "UTF8";
    if (!outFile.open("w")) {
        alert("无法写入文件：\n" + outFile.fsName);
        return;
    }

    // 写入 UTF-8 BOM，方便 Windows Excel 正确识别中文 / 日文
    outFile.write("\uFEFF");

    writeCsvRow(outFile, ["layer_id", "level", "type", "path", "original_name", "new_name"]);

    var count = 0;

    function walk(layers, level, parentPath) {
        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            var type = (layer.typename === "LayerSet") ? "GROUP" : "LAYER";
            var layerId = getLayerId(layer);
            var name = layer.name;
            var path = parentPath ? parentPath + "/" + name : name;

            writeCsvRow(outFile, [
                layerId,
                level,
                type,
                path,
                name,
                name
            ]);

            count++;

            if (layer.typename === "LayerSet") {
                walk(layer.layers, level + 1, path);
            }
        }
    }

    walk(doc.layers, 0, "");
    outFile.close();

    alert("导出完成：" + count + " 个图层 / 图层组\n" + outFile.fsName +
          "\n\n请只翻译最后一列 new_name。保存时请选择 CSV UTF-8。\n不要修改 layer_id。" );

    function writeCsvRow(file, values) {
        var parts = [];
        for (var i = 0; i < values.length; i++) {
            parts.push(csvEscape(values[i]));
        }
        file.writeln(parts.join(","));
    }

    function csvEscape(value) {
        var s = String(value);
        // CSV 标准转义：字段用双引号包围，内部双引号写成两个双引号
        s = s.replace(/"/g, '""');
        return '"' + s + '"';
    }

    function getLayerId(layer) {
        try {
            return layer.id;
        } catch (e) {
            return "";
        }
    }

    function removeExtension(name) {
        return name.replace(/\.[^\.]+$/, "");
    }

    function safeFileName(name) {
        return name.replace(/[\\\/\:\*\?\"\<\>\|]/g, "_");
    }
})();
