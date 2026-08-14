[简体中文](./README.md) | English

# Photoshop Layer Name Export / Import

This is a Photoshop script tool for batch layer-name translation, renaming, and cross-language processing.

- Export script: `Export_PSD_Layer_Names_To_CSV.jsx`
- Import script: `Import_PSD_Layer_Names_From_CSV.jsx`

Workflow:

1. Export all layer and layer group names from the current PSD to CSV in Photoshop
2. Edit the `new_name` column in Excel / Numbers / any text editor
3. Run the import script to write the renamed values back into the original PSD

---

## Features

### 1. Export layer names

When you run `Export_PSD_Layer_Names_To_CSV.jsx`, the script scans all layers and layer groups in the current PSD and generates a CSV file.

The exported data includes:

- `layer_id`: unique layer ID
- `level`: nesting depth
- `type`: `LAYER` or `GROUP`
- `path`: layer path built from parent-child hierarchy
- `original_name`: original layer name
- `new_name`: defaults to the original name and is intended for translation or renaming

The script writes UTF-8 BOM data so Windows Excel can correctly read Chinese, Japanese, and other non-ASCII characters.

### 2. Import layer names

When you run `Import_PSD_Layer_Names_From_CSV.jsx`, select the CSV file you exported earlier. The script reads the `new_name` column and matches it to the corresponding layer or layer group using `layer_id`.

Import rules:

- Only the `new_name` column is read
- Layers are matched by `layer_id` only, not by name text
- Empty `new_name` values are skipped
- Missing matching layers are counted as missing items

---

## How to use

### Export steps

1. Open the PSD file you want to process
2. In Photoshop, go to:
   `File` → `Scripts` → `Browse...`
3. Select `Export_PSD_Layer_Names_To_CSV.jsx`
4. Choose the output location and save the CSV
5. Open the CSV in Excel
6. Only edit the last column, `new_name`
7. Save as `CSV UTF-8`

> Important: Do not modify `layer_id`, and do not delete the header row. Otherwise the import script cannot match the correct layers.

### Import steps

1. Open the PSD that needs renaming
2. Go to:
   `File` → `Scripts` → `Browse...`
3. Run `Import_PSD_Layer_Names_From_CSV.jsx`
4. Select the processed CSV file
5. The script will rename the matched layers and layer groups in bulk by `layer_id`

---

## CSV example

```csv
layer_id,level,type,path,original_name,new_name
1,0,LAYER,Background,Background,Background
2,0,GROUP,UI,UI,Interface
3,1,LAYER,UI/Title,Title,Title
```

You can:

- Change `new_name` to English, Japanese, Traditional Chinese, or other languages
- Translate only the last column
- Keep the other columns unchanged

---

## Notes and limitations

- Best practice: run the import script on the same PSD file or a duplicate copy
- If the layer structure changes significantly, the original `layer_id` values may no longer match the intended layers
- Only the `new_name` column should be edited; the rest of the columns are used for mapping
- Empty `new_name` values are skipped and do not overwrite the original names
- The script does not modify layer styles, smart object content, or other non-name attributes; it only renames layers and layer groups

---

## Use cases

- Batch translation of layer names
- Standardizing naming conventions for design files
- Converting PSD naming to English or mixed-language naming
- Collaborative updates for design-layer naming

---

## Folder structure

```text
PhotopshopExportImportLayerName/
├── Export_PSD_Layer_Names_To_CSV.jsx   # Export layer names
├── Import_PSD_Layer_Names_From_CSV.jsx # Import renamed results
├── README.md                           # Chinese usage guide
├── README.en.md                        # English usage guide
└── Generated CSV files                  # Temporary workflow files
```

---

## Recommended workflow

```text
PSD file
  ↓
Export CSV
  ↓
Edit new_name in Excel
  ↓
Save as UTF-8 CSV
  ↓
Import script writes back names
  ↓
Layer naming update complete
```

If you want, I can also add a bilingual index section to the main README so both Chinese and English versions are linked together more neatly.
