import React from "react";
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

const darkBorderStyles = [
  { bg: "#2d2a19", border: "2px solid #fbbf24" }, // Gold (dark gold)
  { bg: "#3a3d42", border: "2px solid #e5e7eb" }, // Silver (brighter silver)
  { bg: "#3b2321", border: "2px solid #fb923c" }, // Bronze (dark coral)
  { bg: "#23272e", border: "2px solid #6b7280" },
  { bg: "#23272e", border: "2px solid #6b7280" },
];

export default function Leaderboard({
  data,
  title,
  TrendIcon = () => null,
  showRankBefore = false
}) {
  // Detect dark mode from the document
  const isDark = typeof window !== 'undefined' && document.documentElement.classList.contains('dark');
  const styles = isDark ? darkBorderStyles : borderStyles;

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700" sx={{ maxWidth: 600, margin: "32px auto", borderRadius: 4, boxShadow: 5, border: "none", background: "none" }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" className="dark:text-gray-100" sx={{ mb: 2 }}>
          {title}
        </Typography>
        <Divider className="dark:border-gray-600" sx={{ mb: 2 }} />
        <Box>
          {data.length === 0 ? (
            <Typography className="dark:text-gray-300" color="text.secondary">Keine Daten.</Typography>
          ) : (
            data.map((item, i) => (
              <Box
                key={item.label}
                className="dark:bg-gray-700 dark:border-gray-600"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderRadius: 2,
                  px: 2,
                  py: 1.2,
                  mb: 1.4,
                  bgcolor: styles[i]?.bg,
                  border: styles[i]?.border,
                  minHeight: 55
                }}
              >
                <Box sx={{ minWidth: 40 }}>
                  <Chip
                    label={i + 1}
                    size="small"
                    sx={{
                      bgcolor:
                        isDark
                          ? (i === 0
                              ? "#fbbf24"
                              : i === 1
                              ? "#9ca3af"
                              : i === 2
                              ? "#fb923c"
                              : "#6b7280")
                          : (i === 0
                              ? "#ffe082"
                              : i === 1
                              ? "#bdbdbd"
                              : i === 2
                              ? "#ffab91"
                              : "#e0e0e0"),
                      color: isDark ? "#23272e" : "#333",
                      fontWeight: "bold",
                    }}
                  />
                </Box>
                <Box sx={{ flex: 1, ml: 2 }}>
                  <Typography className="dark:text-gray-100" fontWeight="bold">{item.label}</Typography>
                  {showRankBefore && (
                    <Typography
                      className={isDark ? undefined : "dark:text-gray-300"}
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: 13, color: isDark ? '#fff' : undefined }}
                    >
                      {item.rankBefore
                        ? `(vorher: ${item.rankBefore})`
                        : i === 0 && item.trend === "new"
                        ? <span style={{ color: isDark ? '#fff' : undefined }}>Neu im Ranking</span>
                        : ""}
                    </Typography>
                  )}
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 80, justifyContent: "flex-end" }}>
                  {item.trend && <TrendIcon trend={item.trend} />}
                  <Typography className="dark:text-gray-100" fontWeight="medium">{item.value.toLocaleString()}x</Typography>
                </Box>
              </Box>
            ))
          )}
        </Box>
      </CardContent>
    </Card>
  );
}