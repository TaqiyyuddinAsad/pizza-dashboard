import React, { useEffect, useState } from "react";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { fetchProductRanking } from "../services/productService";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Divider,
  Chip,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import StarIcon from "@mui/icons-material/Star";
import RemoveIcon from "@mui/icons-material/Remove";

const { RangePicker } = DatePicker;

const TrendIcon = ({ trend }) => {
  if (trend === "up")
    return <ArrowUpwardIcon fontSize="small" sx={{ color: "green" }} />;
  if (trend === "down")
    return <ArrowDownwardIcon fontSize="small" sx={{ color: "red" }} />;
  if (trend === "new")
    return <StarIcon fontSize="small" sx={{ color: "#1976d2" }} />;
  return <RemoveIcon fontSize="small" sx={{ color: "grey" }} />;
};

const borderColors = [
  "#ffe082", // Gold für Platz 1
  "#bdbdbd", // Silber für Platz 2
  "#ffab91", // Bronze für Platz 3
  "#e0e0e0", // Rest neutral
  "#e0e0e0",
];

const ProductRanking = () => {
  const [ranking, setRanking] = useState([]);
  const [dates, setDates] = useState([
    dayjs("2022-10-01"),
    dayjs("2022-10-07"),
  ]);

  useEffect(() => {
    if (dates?.[0] && dates?.[1]) {
      const start = dates[0].format("YYYY-MM-DD").trim();
      const end = dates[1].format("YYYY-MM-DD").trim();

      fetchProductRanking(start, end)
        .then(setRanking)
        .catch((err) => {
          console.error("❌ Fehler beim Laden des Rankings:", err.message);
        });
    }
  }, [dates]);

  return (
    <Card
      sx={{
        maxWidth: 600,
        margin: "32px auto",
        borderRadius: 4,
        boxShadow: 5,
        border: "2px solid #f0f0f0",
        background: "linear-gradient(135deg, #fafcff 70%, #f2f6fa 100%)",
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Top 5 Produkte (mit Trend)
          </Typography>
          <RangePicker
            value={dates}
            onChange={(val) => setDates(val)}
            format="YYYY-MM-DD"
            allowClear={false}
            style={{ minWidth: 220 }}
          />
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Box>
          {ranking.length === 0 ? (
            <Typography color="text.secondary">Keine Daten.</Typography>
          ) : (
            ranking.map((item, i) => (
              <Box
                key={item.product}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderRadius: 2,
                  border: `2px solid ${borderColors[i] ?? "#e0e0e0"}`,
                  px: 2,
                  py: 1,
                  mb: 1.2,
                  bgcolor:
                    i === 0
                      ? "#fffde7"
                      : i === 1
                      ? "#f7f7f7"
                      : i === 2
                      ? "#fff3e0"
                      : "#fff",
                }}
              >
                <Box sx={{ minWidth: 40, fontWeight: "bold" }}>
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
                  <Typography fontWeight="bold">{item.product}</Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: 13 }}
                  >
                    {item.rankBefore
                      ? `(vorher: ${item.rankBefore})`
                      : i === 0 && item.trend === "new"
                      ? "Neu im Ranking"
                      : ""}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    minWidth: 80,
                    justifyContent: "flex-end",
                  }}
                >
                  <TrendIcon trend={item.trend} />
                  <Typography fontWeight="medium">
                    {item.orders.toLocaleString()}x
                  </Typography>
                </Box>
              </Box>
            ))
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductRanking;
