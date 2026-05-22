import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-hunter-bg">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gradient-indigo glow-text-indigo">
            Hunter3DVisual
          </h1>
          <p className="text-sm text-muted-foreground mt-1">Studio Workspace</p>
        </div>

        <SignUp />
      </div>
    </div>
  );
}
