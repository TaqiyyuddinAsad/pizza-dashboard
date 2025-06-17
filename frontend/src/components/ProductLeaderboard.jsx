import Leaderboard from "./leaderboard";
import { TrendIcon } from "./trendicon";

// fetchProductRanking gibt [{ product, orders, rankNow, rankBefore, trend }]
export default function ProductLeaderboard({ ranking }) {
  const data = ranking.map(x => ({
    label: x.product,
    value: x.orders,
    trend: x.trend,
    rankBefore: x.rankBefore,
  }));
  return (
    <Leaderboard
      data={data}
      title="Top 5 Produkte (mit Trend)"
      TrendIcon={TrendIcon}
      showRankBefore
    />
  );
}
