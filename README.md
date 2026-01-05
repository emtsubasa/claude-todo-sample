# TODO アプリ (Next.js版)

Next.js、TypeScript、Tailwind CSS で構築されたモダンなTODOアプリケーションです。

## 機能

- ✅ タスクの作成、編集、削除（CRUD操作）
- ✅ タスクの完了/未完了の切り替え
- ✅ タスクのフィルタリング（すべて/未完了/完了済み）
- ✅ LocalStorageによるデータの永続化
- ✅ リアルタイムの統計表示
- ✅ レスポンシブデザイン
- ✅ TypeScriptによる型安全性
- ✅ Tailwind CSSによるモダンなUI

## 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS
- **データ永続化**: LocalStorage

## プロジェクト構造

```
claude-todo-sample/
├── app/
│   ├── layout.tsx       # ルートレイアウト
│   ├── page.tsx         # ホームページ
│   └── globals.css      # グローバルスタイル
├── components/
│   ├── TodoApp.tsx      # メインのTODOアプリコンポーネント
│   ├── TodoInput.tsx    # タスク入力コンポーネント
│   ├── TodoList.tsx     # タスクリストコンポーネント
│   ├── TodoItem.tsx     # 個別タスクコンポーネント
│   ├── TodoFilter.tsx   # フィルターコンポーネント
│   └── TodoStats.tsx    # 統計表示コンポーネント
├── next.config.js       # Next.js設定
├── tailwind.config.ts   # Tailwind CSS設定
└── package.json         # 依存関係

```

## セットアップ

### 前提条件

- Node.js 18.0以上
- npm または yarn

### インストール

1. リポジトリをクローン
```bash
git clone https://github.com/emtsubasa/claude-todo-sample.git
cd claude-todo-sample
```

2. 依存関係をインストール
```bash
npm install
# または
yarn install
```

### 開発サーバーの起動

```bash
npm run dev
# または
yarn dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリケーションを確認してください。

## ビルドとデプロイ

### 本番用ビルド

```bash
npm run build
npm run start
```

### 静的エクスポート（GitHub Pages用）

このプロジェクトは静的エクスポート用に設定されています。

```bash
npm run build
```

ビルド後、`out/` ディレクトリに静的ファイルが生成されます。

## 使い方

1. **タスクを追加**: 入力欄にタスクを入力して「追加」ボタンをクリックするか、Enterキーを押します
2. **タスクを完了**: チェックボックスをクリックしてタスクを完了/未完了にします
3. **タスクを編集**: 「編集」ボタンをクリックしてタスクの内容を変更します
4. **タスクを削除**: 「削除」ボタンをクリックしてタスクを削除します
5. **フィルター**: 「すべて」「未完了」「完了済み」ボタンでタスクを絞り込みます
6. **統計**: 画面下部で全体、未完了、完了のタスク数を確認できます

## ライセンス

MIT

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)
