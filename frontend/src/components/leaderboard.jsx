import {
  Card, CardContent, Typography, Box, Divider, Chip
} from "@mui/material";

const borderStyles = [
  { bg: "#fff9e1", border: "2px solid #ffe082" }, // Gold
  { bg: "#efefef", border: "2px solid #bdbdbd" }, // Silber
  { bg: "#ffe7db", border: "2px solid #ffab91" }, // Bronze
  { bg: "#fafbfc", border: "2px solid #e0e0e0" },
  { bg: "#fafbfc", border: "2px solid #e0e0e0" },
];

export default function Leaderboard({
  data,
  title,
  TrendIcon = () => null,
  showRankBefore = false
}) {
  return (
    <Card sx={{ maxWidth: 600, margin: "32px auto", borderRadius: 4, boxShadow: 5, border: "none", background: "none" }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
          {title}
        </Typography>
        <Divider sx={{ mb: 2 }} />
        <Box>
          {data.length === 0 ? (
            <Typography color="text.secondary">Keine Daten.</Typography>
          ) : (
            data.map((item, i) => (
              <Box
                key={item.label}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderRadius: 2,
                  px: 2,
                  py: 1.2,
                  mb: 1.4,
                  bgcolor: borderStyles[i]?.bg,
                  border: borderStyles[i]?.border,
                  minHeight: 55
                }}
              >
                <Box sx={{ minWidth: 40 }}>
                  <Chip
                    label={i + 1}
                    size="small"
                    sx={{
                      bgcolor:
                        i === 0
                          ? "#ffe082"
                          : i === 1
                          ? "#bdbdbd"
                          : i === 2
                          ? "#ffab91"
                          : "#e0e0e0",
                      color: "#333",
                      fontWeight: "bold",
                    }}
                  />
                </Box>
                <Box sx={{ flex: 1, ml: 2 }}>
                  <Typography fontWeight="bold">{item.label}</Typography>
                  {showRankBefore && (
                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
                      {item.rankBefore
                        ? `(vorher: ${item.rankBefore})`
                        : i === 0 && item.trend === "new"
                        ? "Neu im Ranking"
                        : ""}
                    </Typography>
                  )}
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 80, justifyContent: "flex-end" }}>
                  {item.trend && <TrendIcon trend={item.trend} />}
                  <Typography fontWeight="medium">{item.value.toLocaleString()}x</Typography>
                </Box>
              </Box>
            ))
          )}
        </Box>
      </CardContent>
    </Card>
  );
}