import { SignIn } from "@clerk/remix";

export default function SignInPage() {
    return (
        <div className="bg-background flex min-h-screen items-center justify-center">
            <SignIn />
        </div>
    );
}
