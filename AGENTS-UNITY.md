# ⚡ AGENTS-UNITY.md | 全域 AI Agent Unity 遊戲引擎特化規範庫

> **專案作者**: 許哲誠 (HSU, CHE-CHENG)  
> **適用領域**: Unity 6+ 遊戲引擎與 C# 遊戲架構開發  
> **協定性質**: 本文件為純靜態規範庫，**不包含任何可調用指令**。專門定義 Unity C# 腳本命名例外、資材原生格式保全、Inspector 組織最佳實踐、GC 記憶體防護、以及多人協作 Git 衝突預防機制。  
> **參考標準**: Clean Code in C# / Unity 6 官方代碼風格指南 (`Use_a_C__style_guide_for_clean_and_scalable_game_code_Unity_6_edition_e-book.pdf`)。  
> *Release: 2026-09-14*

---

## 🧭 Agent 階段生命週期巡檢地圖 (Lifecycle Fast-Path Routing)

為加速 Agent 閱讀，執行 Unity 任務時請直接跳轉對應章節進行局部深讀：

```
[情境 A: 檔案建立與多人協作] ──> 閱讀【第 1 章】(PascalCase.cs 類別檔名例外、多人 Check-list 分支隔離)
│
[情境 B: C# 腳本編程與命名] ──> 閱讀【第 2 章】(Unity 6 官方 C# 命名矩陣與成員風格)
│
[情境 C: Inspector 與資材管線] ──> 閱讀【第 3 章】(Inspector 組織、原生格式保護、GC 記憶體與物件池)
```

---

## 0. 🏆 獨立運作降級、覆寫與最佳化禁令 (Rules & Strict Ban)

本章節確立本特化規範庫與母協定之交互關係與核心安全限制。

### 0.0 獨立運作降級條款
本條款定義獨立環境下的預設運作基準：
若當前專案未提供 `AGENTS.md`，本文件自動啟用獨立降級模式：強制使用臺灣繁體中文對話、C# 檔案頂部包含繁體中文 Header 區塊註解、遵循 Unity 6 官方命名風格。

### 0.1 Unity 優先級覆寫原則
本條款確立 Unity 遊戲引擎之最高裁判權限：
* **檔名覆寫**: C# 腳本檔名強制採用 **`PascalCase.cs`**，且必須與內部主要類別名稱 100% 精確吻合，強制覆寫通用 `kebab-case` 規則。
* **資材格式覆寫**: 嚴格保留原生多媒體與貼圖格式，免除任何強制轉換 WebP 之通用規範。
* **目錄拓撲彈性**: 不強制死板目錄架構，順應專案既有資產管線與 Assembly Definition (asmdef)。

### 0.2 嚴格禁止執行「專案最佳化」指令 (Optimization Ban)
本條款確立 Unity 專案資產管線之絕對安全紅線：
* Unity 專案內資產引用嚴格依賴 `.meta` 檔案與內部 GUID。
* **Agent 嚴禁在 Unity 專案執行 `AGENTS.md` 第 7 章之「專案最佳化」指令**，以防任何自動化腳本誤刪資產、移動路徑導致 Prefab、Scene 或 Material 產生 Missing Reference 毀滅性破壞。

---

## 1. 🏗️ 檔名例外與多人協作 Git 衝突預防機制

本章節規範 Unity 檔案系統之命名合約與大型專案協作防衝突策略。

### 1.1 PascalCase 類別檔名例外條款
本條款定義 C# 腳本命名之排他規則：
* 通用規範之 `kebab-case` 命名原則，**不適用於** C# 腳本或任何要求 Class 與檔名完全一致之 Unity 資材。
* 所有 C# 腳本檔名，**必須強制**與其內部之類別 (Class)、結構 (Struct) 或列舉 (Enum) 名稱完全一致，採用 **`PascalCase`**（例如：`PlayerHealthManager.cs`, `GameManager.cs`）。
* 專案通用設定、Shaders、Materials 與非腳本通用資材，仍維持 `kebab-case`。

### 1.2 多人協作 Git 衝突預防機制 (`docs/check-list.md`)
本條款規範多人團隊開發時之工作驗收清單隔離原則：
* **單人開發模式**: 使用根目錄之 `docs/check-list.md`。
* **多人分支開發模式**: 使用 `docs/check-lists/check-list-<分支或功能名稱>.md`（例如：`docs/check-lists/check-list-combat.md`）。
* **分支合併回填**: 當分支合併回主分支時，由人類指示 Agent 將該 Feature Checklist 內容整合回主檔 `docs/check-list.md` 中。

---

## 2. 🎯 Unity 6 官方標準 C# 命名規範矩陣

本章節依據 Unity 6 官方最佳實踐確立 C# 成員變數與型別命名風格。

### 2.1 核心語意原則
本條款定義程式碼元素之語意形態：
* **類型 (Class / Enum / Struct / Interface)**：名詞，`PascalCase`
* **方法 (Method)**：動詞開頭，`PascalCase`
* **變數 (Field / Local)**：名詞開頭，`camelCase` 或 `_camelCase`
* **布林值 (`bool`)**：強制以 `is` / `has` / `can` 開頭
* **事件 (Event)**：動詞過去式，`PascalCase`
* **列舉 (Enum)**：`PascalCase`，成員用名詞或形容詞

### 2.2 完整 C# 命名規範矩陣
本矩陣明訂所有 C# 語法元素之標準風格與範例：
| 程式碼元素 | 命名風格 | 語意與前綴規則 | 程式碼範例 |
| :--- | :--- | :--- | :--- |
| **類別 / 結構 / 列舉 / 介面** | `PascalCase` | 使用名詞或名詞片語；介面加 `I` 前綴 | `public class GameManager {}`, `public interface IInteractable {}` |
| **屬性 (Property)** | `PascalCase` | 使用名詞或形容詞，表示狀態或資料 | `public int Health { get; private set; }` |
| **方法 (Method)** | `PascalCase` | **動詞** 或動詞片語開頭，描述動作 | `public void UpdateScore(int value) {}` |
| **私有非序列化欄位** | `camelCase` | 名詞；布林值採用 `is/has/can` 開頭 | `private int score;`, `private bool isPaused;` |
| **私有序列化欄位** | `_camelCase` | 底線 `_` + camelCase，用於 Inspector 序列化 | `[SerializeField] private TextMeshProUGUI _scoreText;` |
| **公開欄位 (不建議)** | `PascalCase` | 一般情況改用 Property；若必須公開則 PascalCase | `public int MaxHealth = 100;` |
| **區域變數 / 方法參數** | `camelCase` | 名詞；布林值採用 `is/has/can` 開頭 | `void DealDamage(int damageAmount) { bool isCriticalHit = false; }` |
| **常數 / Readonly** | `PascalCase` | 名詞，描述邏輯意義而非用途 | `private const int MaxLives = 3;`, `private static readonly Color DefaultColor;` |
| **事件 (Event)** | `PascalCase` | 使用 **動詞過去式** 或名詞事件；搭配 `On` 前綴觸發方法 | `public event Action<int> ScoreChanged;`, `private void OnScoreChanged(int val)` |
| **列舉成員 (Enum Member)** | `PascalCase` | 名詞或形容詞，不加任何前綴 | `public enum DifficultyLevel { Easy, Normal, Hard, Expert }` |
| **陣列 / 集合 (Collection)** | 複數型 | 採用複數名詞，明確表示為集合 | `[SerializeField] private GameObject[] _uiPanels;` |

---

## 3. 🎨 Inspector 組織、資材管線保全與記憶體架構

本章節規範 Unity 編輯器資產組織、記憶體 GC 防禦與專案資材安全。

### 3.1 Inspector 組織結構最佳實踐
本條款規範 Inspector 視窗之欄位可讀性要求：
* 使用 `[Header("...")]` 與 `[Space]` 區分不同模組欄位，將遊戲狀態變數與 UI 元素分開整理。
* 所有需要於 Inspector 調整之非公開欄位，強制宣告為 `[SerializeField] private`，嚴禁濫用 `public` 破壞物件封裝。

### 3.2 遊戲資材原生格式保全原則
本條款定義資產管線與貼圖模型之保護底線：
* **嚴格禁止**對 Unity 貼圖 (Textures)、Sprites、音訊或 FBX 模型進行 WebP 壓縮，必須完整保留 PNG, TGA, EXR, JPG, WAV, MP3 等原生格式，尊重 Unity 內部之 Texture Importer 轉碼管線。
* **目錄結構彈性原則**: Unity 專案資材架構受第三方套件、Asmdef 切分與 Addressables 管線影響，Agent **嚴禁硬性規定固定之資材目錄結構**，新增資材時必須順應現有專案分類存放。

### 3.3 記憶體管理與零垃圾收集架構 (Zero-GC in Update)
本條款明訂高頻影格率防掉幀防禦規範：
* **禁止高頻 GC 分配**: 嚴禁在 `Update()`, `FixedUpdate()`, `LateUpdate()` 等高頻生命週期函數中調用 `new` 建立物件、字串拼接或使用 LINQ 查詢。
* **物件池架構 (Object Pooling)**: 凡子彈、特效、音效或怪物等高頻生成與銷毀物件，強制導入物件池機制，嚴禁直接使用 `Instantiate` 與 `Destroy` 造成記憶體碎裂。

---

## 4. 📄 標準 Unity C# 腳本範例

本章節提供符合本規範所有要求之標準 MonoBehaviour 腳本模板。

### 4.1 標準範例腳本 (GameManager.cs)
本範例展示標準繁體中文 Header 區塊註解、命名慣例與事件封裝實踐：
```csharp
/**
 * ============================================================================
 * 檔案名稱: GameManager.cs
 * 所屬模組: Core Loop (核心遊戲迴圈)
 * 責任描述: 負責管理遊戲狀態生命週期、分數累積與全域事件派發。
 * 設計模式: 套用 Singleton 模式與 Observer 模式。
 * 依賴關係: 依賴 TextMeshProUGUI 更新介面渲染。
 * 邊界處理: 防止重送事件、遊戲暫停狀態互斥保護。
 * ============================================================================
 */

using System;
using TMPro;
using UnityEngine;

public class GameManager : MonoBehaviour
{
    // 單例屬性 (Singleton)
    public static GameManager Instance { get; private set; }

    [Header("Status")]
    private bool isPaused = false;
    private int score = 0;

    [Header("UI Elements")]
    [SerializeField] private TextMeshProUGUI _scoreText;
    [SerializeField] private GameObject _pauseMenu;
    [SerializeField] private GameObject[] _uiPanels;

    // 事件 (動詞過去式)
    public event Action GameStarted;
    public event Action<int> ScoreChanged;

    private void Awake()
    {
        Instance = this;
    }

    public void StartGame()
    {
        score = 0;
        isPaused = false;
        OnGameStarted();
    }

    public void AddScore(int value)
    {
        score += value;
        if (_scoreText != null) _scoreText.text = score.ToString();
        OnScoreChanged(score);
    }

    private void OnGameStarted() => GameStarted?.Invoke();
    private void OnScoreChanged(int newScore) => ScoreChanged?.Invoke(newScore);
}
```