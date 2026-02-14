import { Button } from "@/components/ui/button";
import { SignInButton } from "@clerk/nextjs";

export default async function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignInButton mode="modal">
        <Button size="lg">Sign In</Button>
      </SignInButton>
    </div>
  );
}
