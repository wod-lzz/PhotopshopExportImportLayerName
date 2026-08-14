#target photoshop
app.bringToFront();

/*
  Import_PSD_Layer_Names_From_CSV.jsx
  用途：读取由 Export_PSD_Layer_Names_To_CSV.jsx 导出的 CSV，
       并用最后一列 new_name 重命名当前 PSD 中对应图层 / 图层组。

  注意：
  1. 请在同一个 PSD 或同一份 PSD 的副本上执行。
  2. 只修改 CSV 最后一列 new_name。
  3. Excel 保存时建议选择：CSV UTF-8。
*/

(function () {
    if (app.documents.length === 0) {
        alert("请先打开需要重命名的 PSD 文件。");
        return;
    }

    var doc = app.activeDocument;
    var inFile = File.openDialog("选择翻译后的图层名称 CSV", "CSV:*.csv");
    if (!inFile) return;

    inFile.encoding = "UTF8";
    if (!inFile.open("r")) {
        alert("无法读取文件：\n" + inFile.fsName);
        return;
    }

    var content = inFile.read();
    inFile.close();

    // 去掉 UTF-8 BOM
    if (content.length > 0 && content.charCodeAt(0) === 0xFEFF) {
        content = content.substring(1);
    }

    var rows = parseCsv(content);
    if (rows.length < 2) {
        alert("CSV 内容为空，或没有可导入的数据。");
        return;
    }

    var header = rows[0];
    var idxLayerId = indexOf(header, "layer_id");
    var idxOriginalName = indexOf(header, "original_name");
    var idxNewName = indexOf(header, "new_name");

    if (idxLayerId < 0 || idxNewName < 0) {
        alert("CSV 表头不正确。需要包含 layer_id 和 new_name 列。\n请确认使用导出脚本生成的 CSV。" );
        return;
    }

    var layerMap = {};
    buildLayerMap(doc.layers, layerMap);

    var renamed = 0;
    var unchanged = 0;
    var missing = 0;
    var skippedEmpty = 0;
    var errors = [];

    for (var r = 1; r < rows.length; r++) {
        var cols = rows[r];
        if (!cols || cols.length === 0) continue;

        var layerId = trimBom(String(cols[idxLayerId] || ""));
        var originalName = (idxOriginalName >= 0) ? String(cols[idxOriginalName] || "") : "";
        var newName = String(cols[idxNewName] || "");

        // 完全空行跳过
        if (layerId === "" && newName === "") continue;

        if (newName === "") {
            skippedEmpty++;
            continue;
        }

        var layer = layerMap[layerId];
        if (!layer) {
            missing++;
            continue;
        }

        try {
            if (layer.name !== newName) {
                layer.name = newName;
                renamed++;
            } else {
                unchanged++;
            }
        } catch (e) {
            errors.push("第 " + (r + 1) + " 行：" + originalName + " -> " + newName + "\n" + e.message);
        }
    }

    var msg = "导入完成。\n" +
        "已重命名：" + renamed + "\n" +
        "名称未变化：" + unchanged + "\n" +
        "找不到对应图层：" + missing + "\n" +
        "跳过空 new_name：" + skippedEmpty;

    if (errors.length > 0) {
        msg += "\n\n发生错误：" + errors.length + " 个。" +
               "\n前几个错误：\n" + errors.slice(0, 5).join("\n\n");
    }

    alert(msg);

    function buildLayerMap(layers, map) {
        for (var i = 0; i < layers.length; i++) {
            var layer = layers[i];
            var layerId = getLayerId(layer);
            if (layerId !== "") {
                map[String(layerId)] = layer;
            }
            if (layer.typename === "LayerSet") {
                buildLayerMap(layer.layers, map);
            }
        }
    }

    function getLayerId(layer) {
        try {
            return layer.id;
        } catch (e) {
            return "";
        }
    }

    function indexOf(arr, value) {
        for (var i = 0; i < arr.length; i++) {
            if (String(arr[i]) === value) return i;
        }
        return -1;
    }

    function trimBom(s) {
        if (s.length > 0 && s.charCodeAt(0) === 0xFEFF) {
            return s.substring(1);
        }
        return s;
    }

    // 简单但完整的 CSV 解析器：支持引号、逗号、字段内换行、双引号转义
    function parseCsv(text) {
        var rows = [];
        var row = [];
        var field = "";
        var inQuotes = false;

        for (var i = 0; i < text.length; i++) {
            var ch = text.charAt(i);

            if (inQuotes) {
                if (ch === '"') {
                    if (i + 1 < text.length && text.charAt(i + 1) === '"') {
                        field += '"';
                        i++;
                    } else {
                        inQuotes = false;
                    }
                } else {
                    field += ch;
                }
            } else {
                if (ch === '"') {
                    inQuotes = true;
                } else if (ch === ',') {
                    row.push(field);
                    field = "";
                } else if (ch === '\r') {
                    if (i + 1 < text.length && text.charAt(i + 1) === '\n') i++;
                    row.push(field);
                    rows.push(row);
                    row = [];
                    field = "";
                } else if (ch === '\n') {
                    row.push(field);
                    rows.push(row);
                    row = [];
                    field = "";
                } else {
                    field += ch;
                }
            }
        }

        // 末尾字段
        if (field !== "" || row.length > 0) {
            row.push(field);
            rows.push(row);
        }

        return rows;
    }
})();
