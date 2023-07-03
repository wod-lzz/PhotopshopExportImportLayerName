// 根据导出的图层名称文本文件重命名 Photoshop 图层及其父节点
function renameLayersFromFile() {
  var doc = app.activeDocument;

  var file = new File("~/Desktop/layer_names.txt"); // 导出的图层名称文本文件路径
  file.open("r");

  var layerNames = [];

  // 读取图层名称文件中的每一行并保存到数组中
  while (!file.eof) {
    var layerName = file.readln();
    layerNames.push(layerName);
  }

  file.close();

  // 递归函数，用于重命名图层及其父节点
  function renameLayers(layer, index) {
    if (layer.typename !== "ArtLayer") {
      // 如果图层不是普通图层，则递归处理子图层
      for (var i = 0; i < layer.layers.length; i++) {
        index = renameLayers(layer.layers[i], index);
      }
    }

    // 重命名图层及其父节点
    if (index < layerNames.length) {
      layer.name = layerNames[index];
      index++;
    }

    return index;
  }

  // 从文档根节点开始递归重命名图层及其父节点
  renameLayers(doc, 0);

  alert("图层已重命名");
}

// 调用函数重命名 Photoshop 图层及其父节点
renameLayersFromFile();