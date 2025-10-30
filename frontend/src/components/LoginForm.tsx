"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import styles from "./LoginForm.module.css";

/**
 * ログインフォームコンポーネント
 */
export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * フォームが送信されたときの処理
   * @param e - フォームイベント
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // NextAuth.jsのsignIn関数を呼び出してログイン処理を行う
      const result = await signIn("credentials", {
        redirect: false, // 自分でリダイレクト処理を行うためfalseに設定
        email,
        password,
      });

      if (result?.error) {
        // 認証に失敗した場合 (例: パスワードが違う)
        setError("Invalid email or password.");
      } else if (result?.ok) {
        // 認証に成功した場合、トップページにリダイレクト
        router.push("/");
      }
    } catch (err) {
      setError("Unexpected error occurred.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      {error && <p className={styles.error}>{error}</p>}
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
          {isSubmitting ? "Logging in..." : "Log in"}
        </button>
      </div>
    </form>
  );
}