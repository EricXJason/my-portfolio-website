# AGENTS-UNITY.md | 全域 AI Agent Unity 遊戲引擎特化規範庫

> **專案作者**: 許哲誠 (HSU, CHE-CHENG)  
> **更新日期**: 2026-09-30  
> **適用領域**: Unity 6+ 遊戲引擎與 C# 遊戲架構開發。純靜態規範庫，完全繼承 `AGENTS.md`。

---

## 0. 優先級覆寫與最佳化絕對禁令

- **檔名與類別強約束**: C# 腳本檔名強制採用 **`PascalCase.cs`**，MonoBehaviour 衍生類別名稱必須與檔名 100% 精確一致，防止 GameObject 掛載遺失。
- **.meta 檔案生命週期同步**: 任何資產或腳本的新增、移動、重新命名或刪除，強制同步處理對應之 `.meta` 檔案，嚴禁遺漏或私自竄改 GUID。
- **資材格式覆寫**: 嚴格保留原生多媒體與貼圖格式（PNG, TGA, EXR, WAV, MP3 等），嚴禁強制轉為 WebP，尊重 Texture Importer 管線。
- **⚠️ 最佳化絕對禁令**: **Agent 嚴格禁止在 Unity 專案執行 `AGENTS.md` 之『嚴格專案最佳化』指令！** 杜絕自動化腳本誤移或誤刪資產導致 Prefab、Scene 產生 Missing GUID 毀滅性破壞。

---

## 1. Unity 6 標準 C# 命名規範矩陣

| 程式碼元素 | 命名風格 | 語意與規則 | 範例 |
| :--- | :--- | :--- | :--- |
| **類別 / 結構 / 介面** | `PascalCase` | 名詞；介面加 `I` 前綴 | `public class GameManager`, `public interface IInteractable` |
| **屬性 (Property)** | `PascalCase` | 名詞或形容詞，表示狀態 | `public int Health { get; private set; }` |
| **方法 (Method)** | `PascalCase` | **動詞** 或動詞片語開頭 | `public void UpdateScore(int value)` |
| **一般私有欄位** | `camelCase` | 名詞；布林值以 `is/has/can` 開頭 | `private int score;`, `private bool isPaused;` |
| **Inspector 序列化欄位**| `_camelCase` | 底線 `_` + camelCase，專供 Inspector 顯示 | `[SerializeField] private TextMeshProUGUI _scoreText;` |
| **常數 / Readonly** | `PascalCase` | 名詞，描述邏輯意義 | `private const int MaxLives = 3;` |
| **事件 (Event)** | `PascalCase` | 動詞過去式；搭配 `On` 前綴觸發函式 | `public event Action<int> ScoreChanged;` |

---

## 2. Inspector 組織與記憶體管理

- **Inspector 組織**: 運用 `[Header("...")]` 與 `[Space]` 分類遊戲變數與 UI 元件；供編輯器配置之私有欄位使用 `[SerializeField] private`，嚴禁濫用 `public` 破壞封裝。
- **記憶體防護與 Zero-GC**:
  - 嚴禁在 `Update()`, `FixedUpdate()`, `LateUpdate()` 等高頻更新週期內調用 `new`、字串拼接或使用 LINQ。
  - 子彈、特效、音效等高頻生成銷毀物件，強制導入物件池機制 (Object Pooling)，嚴禁頻繁調用 `Instantiate` 與 `Destroy`。
- **目錄拓撲彈性**: 順應 Unity 專案既有資產分類與 Assembly Definition (asmdef)，不強制死板目錄架構。