import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";

/**
 * 新規ユーザー登録API (POST)
 * @param request - リクエストオブジェクト
 */
export async function POST(request: Request) {
  try {
    // 1. リクエストボディからユーザー情報を取得
    const body = await request.json();
    const { name, email, password } = body;

    // 2. 入力値のバリデーション
    // 名前、メールアドレス、パスワードが空でないかチェックします。
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "名前、メールアドレス、パスワードは必須です。" },
        { status: 400 } // 400 Bad Request: リクエストが不正
      );
    }

    // 3. 既存ユーザーのチェック
    // 同じメールアドレスのユーザーが既に存在しないか確認します。
    const existingUser = await prisma.user.findUnique({
      where: { email: email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "このメールアドレスは既に使用されています。" },
        { status: 409 } // 409 Conflict: 要求が現在のリソースの状態と競合
      );
    }

    // 4. パスワードのハッシュ化
    // パスワードをそのまま保存せず、bcryptで安全なハッシュ値に変換します。
    // 第2引数の10は「ソルトラウンド」で、ハッシュ化の計算コストです。大きいほど安全ですが、処理に時間がかかります。10が一般的です。
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. データベースに新しいユーザーを保存
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // 6. 成功レスポンスを返す
    return NextResponse.json(user, { status: 201 }); // 201 Created: リソースの作成が成功
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json(
      { message: "予期せぬエラーが発生しました。" },
      { status: 500 } // 500 Internal Server Error
    );
  }
}