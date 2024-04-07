import { SignUp } from "@clerk/remix";

export default function SignUpPage() {
    return (
        <div className="from-titan-100 dark:from-gigas-950 flex min-h-screen items-center justify-center bg-gradient-to-b dark:to-black">
            <SignUp />
        </div>
    );
}
