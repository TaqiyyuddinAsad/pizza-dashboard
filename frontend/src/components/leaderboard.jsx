import React, { useState, useEffect } from "react";
import {
  Card, CardContent, Typography, Box, Divider, Chip
} from "@mui/material";

const borderStyles = [
  { bg: "#fffbe7", border: "2px solid #ffe082" },
  { bg: "#efefef", border: "2px solid #bdbdbd" },
  { bg: "#fff2e6", border: "2px solid #ffab91" },
  { bg: "#fafbfc", border: "2px solid #e0e0e0" },
  { bg: "#fafbfc", border: "2px solid #e0e0e0" },
];

const darkBorderStyles = [
  { bg: "#2d2a19", border: "2px solid #fbbf24" },
  { bg: "#3a3d42", border: "2px solid #e5e7eb" },
  { bg: "#3b2321", border: "2px solid #fb923c" },
  { bg: "#23272e", border: "2px solid #6b7280" },
  { bg: "#23272e", border: "2px solid #6b7280" },
];

export default function Leaderboard({
  data,
  title,
  TrendIcon = () => null,
  showRankBefore = false
}) {
  // Reactively detect dark mode
  const [isDark, setIsDark] = useState(() => typeof window !== 'undefined' && document.documentElement.classList.contains('dark'));

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const styles = isDark ? darkBorderStyles : borderStyles;

  return (
    <Card className="dark:bg-gray-800 dark:border-gray-700" sx={{ maxWidth: 600, margin: "32px auto", borderRadius: 4, boxShadow: 5, border: "none", background: "none" }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" className="dark:text-gray-100 text-black" sx={{ mb: 2 }} style={{ color: '#111' }}>
          {title}
        </Typography>
        <Divider className="dark:border-gray-600" sx={{ mb: 2 }} />
        <Box>
          {data.length === 0 ? (
            <Typography className="dark:text-gray-300 text-black" color="text.secondary" style={{ color: '#111' }}>Keine Daten.</Typography>
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
                  <Typography className="dark:text-gray-100 text-black" fontWeight="bold" style={{ color: isDark ? '#fff' : '#111' }}>{item.label}</Typography>
                  {showRankBefore && (
                    <Typography
                      className={isDark ? 'dark:text-white' : 'text-black'}
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: 13, color: isDark ? '#fff' : '#111' }}
                    >
                      {item.rankBefore
                        ? <span className={isDark ? 'dark:text-white' : 'text-black'} style={{ color: isDark ? '#fff' : '#111' }}>(vorher: {item.rankBefore})</span>
                        : i === 0 && item.trend === "new"
                        ? <span className={isDark ? 'dark:text-white' : 'text-black'} style={{ color: isDark ? '#fff' : '#111' }}>Neu im Ranking</span>
                        : ""}
                    </Typography>
                  )}
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 80, justifyContent: "flex-end" }}>
                  {item.trend && <TrendIcon trend={item.trend} />}
                  <Typography className="dark:text-gray-100 text-black" fontWeight="medium" style={{ color: isDark ? '#fff' : '#111' }}>{item.value.toLocaleString()}x</Typography>
                </Box>
              </Box>
            ))
          )}
        </Box>
      </CardContent>
    </Card>
  );
}