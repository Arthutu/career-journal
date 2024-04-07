import { SignIn } from "@clerk/remix";

export default function SignInPage() {
    return (
        <div className="from-titan-100 dark:from-gigas-950 flex min-h-screen items-center justify-center bg-gradient-to-b dark:to-black">
            <SignIn />
        </div>
    );
}
