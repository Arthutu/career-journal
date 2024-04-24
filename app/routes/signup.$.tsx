import { SignUp } from "@clerk/remix";

export default function SignUpPage() {
    return (
        <div className="bg-background flex min-h-screen items-center justify-center">
            <SignUp />
        </div>
    );
}
