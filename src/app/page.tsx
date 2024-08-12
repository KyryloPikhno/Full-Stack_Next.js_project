"use client"
import "@radix-ui/themes/styles.css"

import { Box, Button, Card, Flex, Grid, Switch, Text, TextArea, Theme } from "@radix-ui/themes"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("user-token")

    if (!token) {
      router.push("/todos")
    }
  }, [router])

  return (
    <Theme className="flex min-h-screen flex-col items-center justify-between p-24">
      <Box maxWidth="400px">
        <Card size="2">
          <Flex direction="column" gap="3">
            <Grid gap="1">
              <Text as="div" mb="1" size="2" weight="bold">
                Feedback
              </Text>
              <TextArea placeholder="Write your feedback…" />
            </Grid>
            <Flex asChild justify="between">
              <label>
                <Text color="gray" size="2">
                  Attach screenshot?
                </Text>
                <Switch defaultChecked size="1" />
              </label>
            </Flex>
            <Grid columns="2" gap="2">
              <Button variant="surface">Back</Button>
              <Button>Send</Button>
            </Grid>
          </Flex>
        </Card>
      </Box>
    </Theme>
  )
}
