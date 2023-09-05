import { UserButton } from "@clerk/nextjs"

export default function SetupPage() {
  return (
    <div>
      SetupPage
      <UserButton afterSignOutUrl="/" />
    </div>
  )
}
