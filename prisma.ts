import { PrismaClient } from '@prisma/client';

// 開発環境でのみ、PrismaClientのインスタンスをグローバルオブジェクトに保存します。
// これにより、ホットリロード（ファイルの変更が即座に反映される機能）によって
// PrismaClientのインスタンスが不必要に増え続けるのを防ぎます。

declare global {
  // グローバル変数として `prisma` を定義することを許可します。
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// グローバルに `prisma` インスタンスが存在すればそれを使い、なければ新しく作成します。
export const prisma = global.prisma || new PrismaClient();

// 開発環境の場合、作成したインスタンスをグローバルに保存します。
if (process.env.NODE_ENV !== 'production') global.prisma = prisma;