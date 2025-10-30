import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

/**
 * NextAuthの型定義を拡張して、セッションとJWTにカスタムプロパティを追加します。
 */

declare module "next-auth" {
  /**
   * `useSession` や `getSession` で返される Session オブジェクトの型です。
   * デフォルトの user プロパティに `id` を追加します。
   */
  interface Session {
    user: {
      id: string;
    } & DefaultSession["user"]; // name, email, image を維持
  }
}

declare module "next-auth/jwt" {
  /** `jwt` コールバックで返される JWT の型です。`id` を追加します。 */
  interface JWT {
    id: string;
  }
}