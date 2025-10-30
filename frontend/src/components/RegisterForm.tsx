"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import styles from "./RegisterForm.module.css";

/**
 * @file RegisterForm.tsx
 * 新規登録フォームコンポーネント
 */
export default function RegisterForm() {
  // useRouterフックを使って、ページ遷移をプログラム的に行うためのルーターオブジェクトを取得します。
  // 登録成功後にログインページへリダイレクトするために使います。
  const router = useRouter();

  // useStateフックを使って、フォームの入力値を状態として管理します。
  // これらはそれぞれ、名前、メールアドレス、パスワードの入力欄に対応します。
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // エラーメッセージを管理するための状態です。
  const [error, setError] = useState("");
  // フォーム送信中の二重送信を防ぐための状態です。
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * フォームが送信されたときの処理
   * @param e - フォームイベント
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // フォーム送信時のデフォルトのページリロードを防ぎます。
    setError(""); // 前回のエラーメッセージをクリア
    setIsSubmitting(true); // 送信中の状態にする

    try {
      // fetch APIを使って、作成済みの新規登録APIにPOSTリクエストを送信します。
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // フォームの入力値をJSON形式でリクエストボディに含めます。
        body: JSON.stringify({ name, email, password }),
      });

      // レスポンスが成功（2xxステータス）でなければ、エラーとして処理します。
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Registration failed.");
        return;
      }

      // 登録が成功したら、ログインページにリダイレクトします。
      router.push("/auth/signin");
    } catch (err) {
      setError("Unexpected error occurred.");
      console.error(err);
    } finally {
      setIsSubmitting(false); // 送信完了（成功・失敗問わず）で状態を解除
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      {error && <p className={styles.error}>{error}</p>}
      <div>
        <label htmlFor="name" className={styles.label}>
          Name
        </label>
        <div className={styles.inputContainer}>
          <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required className={styles.input}/>
        </div>
      </div>
      <div>
        <label htmlFor="email" className={styles.label}>
          Email
        </label>
        <div className={styles.inputContainer}>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={styles.input}/>
        </div>
      </div>
      <div>
        <label htmlFor="password" className={styles.label}>
          Password
        </label>
        <div className={styles.inputContainer}>
          <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className={styles.input}/>
        </div>
      </div>
      <div>
        <button type="submit" disabled={isSubmitting} className={styles.button}>
          {isSubmitting ? "Submitting..." : "Register"}
        </button>
      </div>
    </form>
  );
}