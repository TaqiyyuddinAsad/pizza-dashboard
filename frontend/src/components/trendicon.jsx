import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import StarIcon from "@mui/icons-material/Star";
import RemoveIcon from "@mui/icons-material/Remove";
import React from "react";

export function TrendIcon({ trend }) {
  if (trend === "up") return <ArrowUpwardIcon fontSize="small" sx={{ color: "green" }} />;
  if (trend === "down") return <ArrowDownwardIcon fontSize="small" sx={{ color: "red" }} />;
  if (trend === "new") return <StarIcon fontSize="small" sx={{ color: "#1976d2" }} />;
  return <RemoveIcon fontSize="small" sx={{ color: "grey" }} />;
}

export default React.memo(TrendIcon);