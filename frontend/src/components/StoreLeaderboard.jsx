import Leaderboard from "./Leaderboard";
import { TrendIcon } from "./trendicon";

// fetchStoreRanking gibt [{ store, orders, rankNow, rankBefore, trend }]
export default function StoreLeaderboard({ ranking }) {
  const data = ranking.map(x => ({
    label: x.store,
    value: x.orders,
    trend: x.trend, // Wenn du Trends mitberechnen willst!
    rankBefore: x.rankBefore,
  }));
  return (
    <Leaderboard
      data={data}
      title="Top 5 Filialen (mit Trend)"
      TrendIcon={TrendIcon}
      showRankBefore
    />
  );
}
