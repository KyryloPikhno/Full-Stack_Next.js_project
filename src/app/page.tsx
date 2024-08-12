import "@radix-ui/themes/styles.css"

import { Button, Theme } from "@radix-ui/themes"

export default function Home() {
  return (
    <Theme className="flex min-h-screen flex-col items-center justify-between p-24">
      <Button color="orange" highContrast radius="large" variant="solid">
        Click me
      </Button>
    </Theme>
  )
}
