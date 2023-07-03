// 导出图层及其父级图层名称为文本文件
function exportLayerNames(layer, file, parentName) {
  var layerName = layer.name;
  
  if (layer.typename === "LayerSet") {
    for (var i = 0; i < layer.layers.length; i++) {
      var subLayer = layer.layers[i];
      exportLayerNames(subLayer, file, layerName);
    }
  }
  file.writeln(layerName);
}

// 导出所有图层及其父级图层的名称
function exportAllLayerNames() {
  var doc = app.activeDocument;
  var layers = doc.layers;
  
  var file = new File("~/Desktop/layer_names.txt"); // 设置导出的文件路径和名称
  file.open("w");
  
  for (var i = 0; i < layers.length; i++) {
    var layer = layers[i];
    exportLayerNames(layer, file, "");
  }
  
  file.close();
  alert("图层名称已导出到 layer_names.txt 文件");
}

// 调用函数导出所有图层及其父级图层的名称
exportAllLayerNames();