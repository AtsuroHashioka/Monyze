# Monyze - 家計簿アプリ

日々の収入と支出を記録できる、シンプルな家計簿Webアプリです。

---

## 技術スタック

*   **Next.js**: フロントエンドとバックエンド
*   **PostgreSQL**: データを保存しておくための「データベース」。
*   **Docker**: PCの中に仮想的な「開発部屋」を作ってくれるツール。
*   **Prisma**: アプリとデータベースの「通訳」をしてくれるツール。
*   **NextAuth.js**: 認証機能（ログイン・新規登録）を簡単に実装するためのライブラリ。
*   **bcrypt**: パスワードを安全に保管するためのライブラリ。

---

## セットアップ手順

1.  **リポジトリをクローンします。**

2.  **環境変数を設定します。**
    プロジェクトルートに `.env` と `frontend/.env` を作成し、必要な値を設定します。
    -   `/.env`: `POSTGRES_USER` と `POSTGRES_PASSWORD` を設定します。
    -   `/frontend/.env`: `DATABASE_URL` と `NEXTAUTH_SECRET` を設定します。
    -   `NEXTAUTH_SECRET` はターミナルで `openssl rand -base64 32` を実行して生成できます。

3.  **Dockerコンテナを起動します。**
    プロジェクトのルートディレクトリで実行してください。
    ```bash
    docker-compose up -d
    ```

4.  **依存関係をインストールします。**
    `frontend` ディレクトリに移動して実行してください。
    ```bash
    cd frontend
    npm install
    ```

5.  **データベースのマイグレーションを実行します。**
    `frontend` ディレクトリで実行してください。
    ```bash
    npx prisma migrate dev
    ```

6.  **開発サーバーを起動します。**
    `frontend` ディレクトリで実行してください。
    ```bash
    npm run dev
    ```
    http://localhost:3000 でアプリケーションにアクセスできます。

---

## ディレクトリ構成

```
.
├── frontend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/
│   │   │   │   └── auth/
│   │   │   │       └── [...nextauth]/
│   │   │   │           └── route.ts
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   └── lib/
│   │       └── prisma.ts
│   ├── .env
│   └── package.json
├── .env
├── .gitignore
├── DEVELOPMENT_LOG.md
├── GEMINI.md
├── README.md
└── docker-compose.yml
```

### 主要ファイルの役割

*   `docker-compose.yml`: データベース（PostgreSQL）をDockerコンテナとして起動するための設定ファイルです。
*   `.env`: `docker-compose.yml`が参照する環境変数ファイル。データベースのユーザー名やパスワードを定義します。
*   `frontend/`: Next.jsアプリケーションのすべてのソースコードが含まれています。
*   `frontend/.env`: Next.jsアプリケーションが参照する環境変数ファイル。データベース接続URLや認証用の秘密鍵を定義します。
*   `frontend/prisma/schema.prisma`: Prismaのスキーマ定義ファイル。データベースのテーブル構造（モデル）を定義します。
*   `frontend/src/app/api/auth/[...nextauth]/route.ts`: NextAuth.jsの認証処理の司令塔となるファイルです。ログイン時の本人確認ロジックなどをここに記述します。
*   `DEVELOPMENT_LOG.md`: 開発の経緯や手順、発生した問題などを記録する開発日誌です。
