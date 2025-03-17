# Mini Agent

エージェントの挙動を作って学ぶためのサンプルプロジェクトです。

## 使用している主な技術

- TypeScript
- Jest (テストフレームワーク) 。今は入ってるだけ
- Vercel AI SDK (OpenAI統合)

## 環境変数の設定

`.env.local`ファイルを作成し、以下の環境変数を設定してください：

```
OPENAI_API_KEY=your_api_key_here # OpenAI API Key
TEMP_DIR=directory_name #  ファイル操作を許可するコードベース配下のディレクトリ名
```

## 開発環境のセットアップ

インストール

```bash
npm install
```

起動

```bash
npm start
```