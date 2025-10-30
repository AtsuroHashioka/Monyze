import LoginForm from "@/components/LoginForm";
import "../../globals.css";
import Link from "next/link";
import SocialLoginButtons from "@/components/SocialLoginButtons";

/**
 * ログインページ
 */
export default function SignInPage() {
  return (
    <div className="pageContainer">
      <h2 className="pageTitle">Log in to Monyze</h2>
      <div className="formWrapper">
        <SocialLoginButtons />
        <div className="divider">
          <span className="dividerText">OR</span>
        </div>
        <LoginForm />
      </div>
      <p className="redirectText">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="redirectLink">
          Register
        </Link>
      </p>
    </div>
  );
}