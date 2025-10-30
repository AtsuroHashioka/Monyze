"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import styles from "./Header.module.css";

export default function Header() {
  const { data: session, status } = useSession();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          Monyze
        </Link>
        <nav className={styles.nav}>
          {status === "loading" ? (
            // セッション情報取得中は何も表示しない
            <div className={styles.loading}>Loading...</div>
          ) : session ? (
            // ログイン済みの場合
            <>
              <span className={styles.userName}>{session.user?.name}</span>
              <button onClick={() => signOut()} className={styles.button}>
                Log out
              </button>
            </>
          ) : (
            // 未ログインの場合
            <>
              <Link href="/auth/signin" className={styles.link}>
                Log in
              </Link>
              <Link href="/register" className={styles.button}>
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}