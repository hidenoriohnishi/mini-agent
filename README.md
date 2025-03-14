# Mini Agent

Next.js、TypeScript、Jest、StandardJS、Vercel AI SDK（OpenAI）を使用したプロジェクトです。

## 開発環境のセットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# テストの実行
npm test

# テストの監視モード
npm run test:watch
```

## 環境変数の設定

`.env.local`ファイルを作成し、以下の環境変数を設定してください：

```
OPENAI_API_KEY=your_api_key_here
```

## 使用している主な技術

- Next.js
- TypeScript
- Jest (テストフレームワーク)
- StandardJS (コードスタイル)
- Vercel AI SDK (OpenAI統合)
- picocolors (ターミナルの色付け) 