import RegisterForm from "@/components/RegisterForm";
import "../globals.css"; // グローバルCSSをインポート
import Link from "next/link";

/**
 * 新規登録ページ
 */
export default function RegisterPage() {
  return (
    <div className="pageContainer">
      <h2 className="pageTitle">Create your Monyze account</h2>
      <RegisterForm />
      <p className="redirectText">
        Already have an account?{" "}
        <Link href="/auth/signin" className="redirectLink">
          Log in
        </Link>
      </p>
    </div>
  );
}