import { Card, CardContent, Typography } from "@mui/material"

export default function ErrorPanel({ error }: { error: any }) {
  const networkErr = (error as any)?.networkError as any
  const status = networkErr?.statusCode ?? networkErr?.status ?? null
  const result = networkErr?.result ?? networkErr?.body ?? null
  return (
    <Card sx={{ mb: 2 }} variant="outlined">
      <CardContent>
        <Typography color="error" gutterBottom>
          Fehler: {error.message}{status ? ` (HTTP ${status})` : ""}
        </Typography>
        {result && (
          <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", fontSize: 12, marginTop: 8 }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
      </CardContent>
    </Card>
  )
}
