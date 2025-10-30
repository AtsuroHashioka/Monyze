# 【初心者向け】Next.js + Docker + Prismaで作る！家計簿アプリ開発の第一歩（環境構築編）

この記事では、家計簿アプリ「Monyze」を開発する過程で行った「開発環境の構築」と「データベースの準備」について、初心者の方にも分かりやすく解説します。

「Dockerって何？」「データベースって難しそう…」と感じている方でも、この記事を読めば、モダンなWebアプリ開発の第一歩を踏み出せます！

---

## 1. 何を作るの？

日々の収入と支出を記録できる、シンプルな家計簿Webアプリ「Monyze」を作ります。

**主な技術スタック（使う道具たち）**
*   **Next.js**: アプリの見た目（フロントエンド）と裏側の処理（バックエンド）を両方作れる人気のフレームワーク。
*   **PostgreSQL**: データを保存しておくための「データベース」。
*   **Docker**: PCの中に仮想的な「開発部屋」を作ってくれるツール。
*   **Prisma**: アプリとデータベースの「通訳」をしてくれるツール。
 
---
 
## 2. データベースの準備：Dockerで「データの保管庫」を用意しよう
 
アプリのデータ（ユーザー情報や収支記録）を保存する場所が必要です。これを「データベース」と呼びます。今回はPostgreSQLというデータベースを使いますが、PCに直接インストールするのではなく、「Docker」という便利なツールを使います。

**Dockerとは？**
あなたのPCの中に、他の環境から隔離された仮想的な「開発部屋（コンテナ）」を作ってくれるツールです。この部屋の中にデータベースを置くことで、あなたのPC本体の環境を汚さずに済み、後片付けも簡単になります。

### 手順1: データベースの「設計図」を作る (`docker-compose.yml`)

まず、Dockerに「どんな開発部屋を作ってほしいか」を指示する設計図ファイル (`docker-compose.yml`) を用意します。

**`/home/atsuro/workspace/Monyze/docker-compose.yml`**
```dockercompose
version: '3.8'

services:
  db:
    image: postgres:15-alpine
    restart: always
    environment:
      POSTGRES_DB: monyze
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    ports:
      - "5432:5432"
    volumes:
      - db_data:/var/lib/postgresql/data

volumes:
  db_data:
```
**解説:**
*   `image: postgres:15-alpine`: 「PostgreSQL（バージョン15の軽量版）というソフトウェアを入れてください」
*   `environment`: 「データベースの名前は`monyze`、ユーザー名とパスワードは別のファイルから読み込んでください」
*   `ports: - "5432:5432"`: 「あなたのPCの5432番ドアと、この開発部屋の5432番ドアを繋いでください」（これでPCからデータベースにアクセスできます）
*   `volumes`: 「部屋の中のデータは、コンテナを消してもなくならないように、別の場所に保管しておいてください」

### 手順2: パスワードを「秘密のメモ」に書く (`.env`)

設計図に直接パスワードを書くのは危険です。そこで、別の「秘密のメモ」ファイル (`.env`) を作り、そこにパスワードを書いておきます。

**`/home/atsuro/workspace/Monyze/.env`**
```shell
# Docker Compose用の環境変数
POSTGRES_USER=a.hashioka
POSTGRES_PASSWORD=0305
```
このファイルは `.gitignore` に記載して、GitHubなどにはアップロードしないようにします。

### 手順3: データベースを起動する！

設計図と秘密のメモができたので、Dockerに開発部屋を作ってもらいましょう。プロジェクトのルートディレクトリで以下のコマンドを実行します。

```bash
# 設計図を元に、バックグラウンドで開発部屋を起動して！
docker-compose up -d
```

これで、あなたのPCの裏側でPostgreSQLデータベースが動き始めました！

---

## 3. データベースの設計：Prismaで「データの形」を決めよう

データベースが用意できたので、次に「どんなデータを保存するか」の設計をします。ここで登場するのが「Prisma」です。

**Prismaとは？**
アプリ（Next.js）とデータベース（PostgreSQL）の間に立ってくれる「通訳」です。Prismaを使えば、難しいデータベース言語（SQL）を書かなくても、簡単にデータを操作できます。

### 手順1: Prismaの初期設定と「設計書」の作成

まず、Prismaをインストールし、初期設定を行います。

```bash
# frontendディレクトリに移動
cd frontend

# Prismaをインストール
npm install prisma --save-dev

# Prismaの初期設定（schema.prismaファイルなどが作られる）
npx prisma init
```

次に、Prismaの「設計書」である `schema.prisma` ファイルに、どんなデータを保存したいかを書いていきます。

**`/home/atsuro/workspace/Monyze/frontend/prisma/schema.prisma`**
```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  password      String
  // ... 他の項目
  transactions Transaction[]
}

model Transaction {
  id          String    @id @default(cuid())
  amount      Int
  type        String
  date        DateTime
  category    String
  // ... 他の項目
  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId String
}
```
**解説:**
*   `model User`: 「ユーザー情報」を保存するための設計です。名前やメールアドレスなどを保存します。
*   `model Transaction`: 「収支記録」を保存するための設計です。金額やカテゴリなどを保存します。
*   `@relation`: `User`と`Transaction`を紐付け、「この収支記録は、どのユーザーのものか」を管理できるようにしています。

### 手順2: アプリにデータベースの「住所」を教える

Prismaがデータベースに接続できるよう、`frontend/.env` ファイルにデータベースの「住所」(`DATABASE_URL`)を教えます。

**`/home/atsuro/workspace/Monyze/frontend/.env`**
```dotenv
DATABASE_URL="postgresql://a.hashioka:0305@localhost:5432/monyze?schema=public"
```
これは「`localhost`（このPC）の`5432`番ドアにいる`monyze`というデータベースに、`a.hashioka`というユーザー名と`0305`というパスワードで接続してください」という意味です。

### 手順3: 設計書をデータベースに反映させる（マイグレーション）

最後に、Prismaの設計書を、Dockerで動いている実際のデータベースに反映させます。この作業を「マイグレーション」と呼びます。

```bash
# 設計書（schema.prisma）の通りに、データベースのテーブルを作って！
npx prisma migrate dev --name init_user_and_transaction_tables
```

---

## 4.【重要】よくあるトラブルと解決策

マイグレーション実行時に `Authentication failed` (認証失敗) というエラーが出ることがあります。

**原因:**
Dockerで一度作ったデータベースは、最初のユーザー名とパスワードを記憶しています。後からパスワードなどを変更しても、古いデータが残っていると、新しいパスワードでログインできません。

**解決策:**
古いデータベースのデータごと、コンテナを完全に削除して作り直します。

```bash
# プロジェクトのルートディレクトリで実行

# コンテナと、データ保管場所（ボリューム）も一緒に削除して！
docker-compose down -v

# もう一度、まっさらな状態でコンテナを起動して！
docker-compose up -d
```

この後、再度 `npx prisma migrate dev` を実行すれば、今度は成功するはずです。

---

お疲れ様でした！これで、Monyzeアプリのデータを保存するための頑丈な土台が完成しました。
次のステップでは、いよいよNextAuth.jsを使ってユーザー登録・ログイン機能を実装していきます。

---

## 5. ユーザー認証の準備：NextAuth.jsでログインの仕組みを作ろう

データベースの土台ができたので、次はユーザーがログイン・新規登録するための仕組みを作ります。これには`NextAuth.js`という認証の専門家ライブラリを使います。

### 手順1: 必要な道具（ライブラリ）をインストール

認証機能とパスワードを安全に管理するための道具をインストールします。

```bash
# frontendディレクトリで実行
npm install next-auth bcrypt
npm install --save-dev @types/bcrypt
```
*   `next-auth`: ログインやログアウトの仕組みを簡単に作れるライブラリ。
*   `bcrypt`: パスワードを安全な暗号に変換してくれるライブラリ。

### 手順2: データベースとの「専用通路」を作成

アプリがデータベースと効率よく通信するための専用ファイル (`/src/lib/prisma.ts`) を作成します。これにより、不必要なデータベース接続が増えるのを防ぎ、アプリを安定させます。

### 手順3: 認証の「司令塔」を作成

NextAuth.jsが認証処理を行うための中心的なファイル (`/src/app/api/auth/[...nextauth]/route.ts`) を作成します。このファイルに、「メールアドレスとパスワードが送られてきたら、データベースの情報と照合して本人確認を行う」という具体的な手順を記述しました。

### 手順4: セキュリティのための「秘密の鍵」を設定

ログイン状態を安全に保つための「秘密の鍵」(`NEXTAUTH_SECRET`) を生成し、`frontend/.env` ファイルに設定しました。これにより、第三者がセッション情報を盗み見るのを防ぎます。

---

これで、ユーザー認証機能のバックエンド（裏側の処理）の準備が整いました。
次のステップでは、ユーザーが実際にメールアドレスやパスワードを入力するための「ログインページ」や「新規登録ページ」の見た目（UI）を作成していきます。