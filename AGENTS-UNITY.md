# AGENTS-UNITY.md | 全域 AI Agent Unity 特化規範庫

> **專案作者**: 許哲誠 (HSU, CHE-CHENG)[cite: 7]  
> **適用領域**: Unity 6+ 遊戲引擎與 C# 遊戲架構特化規範庫。純靜態規範庫，完全繼承 `AGENTS.md`。[cite: 7]

---

## 0. 優先級覆寫與最佳化絕對禁令

* **檔名覆寫**: C# 腳本檔名強制採用 **`PascalCase.cs`**，且必須與內部主要類別名稱 100% 精確吻合，強制覆寫通用 `kebab-case` 規則。[cite: 7]
* **資材格式覆寫**: 嚴格保留原生多媒體與貼圖格式，免除任何強制轉換 WebP 之規範。[cite: 7]
* **⚠️ 最佳化指令絕對禁令**: **Agent 嚴禁在 Unity 專案執行 `AGENTS.md` 之『專案最佳化』指令！** 杜絕自動化清理腳本誤移或誤刪資產導致 Prefab、Scene 產生 Missing GUID 毀滅性破壞。[cite: 7]

---

## 1. 檔案系統規範

* **PascalCase 類別檔名合約**: 所有 C# 腳本檔名強制與其內部之 Class / Struct / Enum 完全一致（例如 `PlayerHealthManager.cs`）；Shaders、Materials 與通用配置仍維持 `kebab-case`。[cite: 7]
* **資材目錄拓撲彈性**: 順應 Unity 專案既有資產管線與 Assembly Definition (asmdef)，嚴禁硬性規定固定目錄結構。[cite: 7]

---

## 2. Unity 6 官方標準 C# 命名規範矩陣

| 程式碼元素 | 命名風格 | 語意與前綴規則 | 範例 |
| :--- | :--- | :--- | :--- |
| **類別 / 結構 / 列舉 / 介面** | `PascalCase` | 名詞；介面強制加 `I` 前綴 | `public class GameManager`, `public interface IInteractable`[cite: 7] |
| **屬性 (Property)** | `PascalCase` | 名詞或形容詞，表示狀態 | `public int Health { get; private set; }`[cite: 7] |
| **方法 (Method)** | `PascalCase` | **動詞** 或動詞片語開頭 | `public void UpdateScore(int value)`[cite: 7] |
| **私有非序列化欄位** | `camelCase` | 名詞；布林值以 `is/has/can` 開頭 | `private int score;`, `private bool isPaused;`[cite: 7] |
| **私有序列化欄位** | `_camelCase` | 底線 `_` + camelCase，用於 Inspector | `[SerializeField] private TextMeshProUGUI _scoreText;`[cite: 7] |
| **常數 / Readonly** | `PascalCase` | 名詞，描述邏輯意義 | `private const int MaxLives = 3;`[cite: 7] |
| **事件 (Event)** | `PascalCase` | 動詞過去式；搭配 `On` 前綴觸發函式 | `public event Action<int> ScoreChanged;`[cite: 7] |
| **集合 (Collection)** | 複數型 | 採用複數名詞，明確表示為集合 | `[SerializeField] private GameObject[] _uiPanels;`[cite: 7] |

---

## 3. Inspector 組織、資材保全與記憶體管理

* **Inspector 組織結構**:
  * 使用 `[Header("...")]` 與 `[Space]` 清楚隔離遊戲狀態變數與 UI 元件。[cite: 7]
  * 供 Inspector 調整之非公開欄位強制使用 `[SerializeField] private`，嚴禁濫用 `public` 破壞封裝。[cite: 7]
* **原生資材格式保全**: 嚴禁對 Unity 貼圖、Sprites、音訊或 FBX 模型進行 WebP 壓縮，必須保留 PNG, TGA, EXR, WAV, MP3 等原生格式，尊重 Texture Importer 轉碼管線。[cite: 7]
* **記憶體防護與 Zero-GC**:
  * 嚴禁在 `Update()`, `FixedUpdate()`, `LateUpdate()` 等高頻週期中調用 `new`、字串拼接或使用 LINQ 查詢。[cite: 7]
  * 子彈、特效、音效或敵人等高頻生成銷毀物件，強制導入物件池機制（Object Pooling），嚴禁直接使用 `Instantiate` 與 `Destroy`。[cite: 7]