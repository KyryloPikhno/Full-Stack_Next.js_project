export const handleError = (errorMessage: string, status: number) => {
  return new Response(JSON.stringify({ error: errorMessage }), {
    headers: { "Content-Type": "application/json" },
    status,
  })
}
