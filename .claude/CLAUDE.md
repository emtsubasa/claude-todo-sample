# claude-todo-sample プロジェクト固有ルール

このプロジェクトで開発する際に必ず守るべきルールと注意事項

## テスト実装時の必須事項

### 要素の特定方法
- **要素選択は必ずテキストやaria-labelから行うこと**
- `screen.getAllByRole('checkbox')[1]` のようなインデックスベースの選択は禁止
- ソート順や表示順が変わっても壊れないテストを書くこと

**良い例**:
```typescript
const completedTaskElement = screen.getByText('Completed task');
const checkbox = completedTaskElement.closest('div')?.querySelector('input[type="checkbox"]');
await user.click(checkbox);
```

**悪い例**:
```typescript
const checkboxes = screen.getAllByRole('checkbox');
await user.click(checkboxes[1]); // インデックス依存は禁止
```

### 新機能追加時の確認
- 新機能を追加したら、必ず既存テストが全て成功することを確認すること
- ソート順や表示順を変更する機能では、既存テストへの影響を特に注意すること
- テストカバレッジは必ず確認し、新規コードは80%以上を目指すこと

## Vercelデプロイ

### デプロイ前の確認事項
- GitHub連携を使う場合、Vercel GitHub Appがインストールされていることを確認すること
- GitHub設定 > Applications > Installed GitHub Apps で確認可能
- インストールされていない場合: https://github.com/apps/vercel からインストール

### ブランチ戦略
- `main`: 本番環境（Vercel自動デプロイ対象）
- `feature/*`: 機能開発ブランチ
- PR作成時、Vercelが自動的にプレビュー環境を生成する
- 必ずプレビュー環境で動作確認してからマージすること

## ファイル管理

### 自動生成ファイル
- `next-env.d.ts`: Next.jsが自動生成するファイル。削除不要（`.gitignore`で除外済み）
- 開発サーバー起動時に自動再生成されるため、手動管理不要

## 開発フロー

### 機能追加の標準手順
1. `feature/*` ブランチを作成
2. 機能実装とテストを同時に作成
3. `npm run test:coverage` でカバレッジ確認（80%以上）
4. 全テストが成功することを確認
5. コミット・プッシュ
6. PRを作成
7. プレビュー環境で動作確認
8. mainにマージ（本番環境に自動デプロイ）

### コミットメッセージ
- 改行が必要な場合はHEREDOCを使用すること
- 詳細な説明を含める場合は複数行で記載
- Co-Authored-Byでクレジットを記載

## プロジェクト情報

- テストフレームワーク: Vitest
- UIフレームワーク: Next.js 14 (App Router)
- スタイリング: Tailwind CSS
- デプロイ: Vercel
- 本番URL: https://claude-todo-sample.vercel.app
- リポジトリ: https://github.com/emtsubasa/claude-todo-sample

## 重要な教訓

### テスト関連
- ソート機能追加時、デフォルトの表示順が変わり既存テストが失敗した
- 原因: テストがインデックスベースで要素を選択していた
- 対策: テキストベースの要素特定に変更し、表示順に依存しないテストに修正

### Vercel連携
- 初回デプロイ時、GitHub連携が失敗した
- 原因: Vercel GitHub Appが未インストールだった
- 対策: アプリをインストール後、`vercel git connect`で再接続

---

最終更新: 2026-01-05
