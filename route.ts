import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma'; // ステップ2で作成した専用通路をインポート
import bcrypt from 'bcrypt';

export const authOptions: AuthOptions = {
  // 認証方法のリスト
  providers: [
    // メールアドレスとパスワードで認証する方法（CredentialsProvider）を設定
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      // 認証ロジック本体
      async authorize(credentials) {
        // メールアドレスかパスワードが入力されていない場合はエラー
        if (!credentials?.email || !credentials?.password) {
          throw new Error('メールアドレスとパスワードを入力してください');
        }

        // 1. 入力されたメールアドレスを元に、データベースからユーザーを探す
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        // 2. ユーザーが見つからない、またはパスワードが設定されていない場合はエラー
        if (!user || !user.password) {
          throw new Error('メールアドレスまたはパスワードが正しくありません');
        }

        // 3. 入力されたパスワードと、データベースの暗号化されたパスワードを比較
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        // 4. パスワードが一致しない場合はエラー
        if (!isPasswordValid) {
          throw new Error('メールアドレスまたはパスワードが正しくありません');
        }

        // 5. すべてのチェックを通過したら、ユーザー情報を返してログイン成功
        return user;
      },
    }),
  ],
  // セッション管理の方法を 'jwt' (JSON Web Token) に設定
  session: {
    strategy: 'jwt',
  },
  // セッションを暗号化するための秘密鍵。後で設定します。
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };