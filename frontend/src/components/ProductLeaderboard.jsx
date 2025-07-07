import Leaderboard from "./leaderboard";
import { TrendIcon } from "./trendicon";

// Helper function to format product names
const formatProductName = (product) => {
  // If it's already a readable name (contains spaces or is longer than 10 chars), return as is
  if (product.includes(' ') || product.length > 10) {
    return product;
  }
  
  // If it's a SKU (like PIZZA001), try to convert to readable name
  const skuToName = {
    'PIZZA001': 'Margherita Pizza',
    'PIZZA002': 'Pepperoni Pizza',
    'PIZZA003': 'Hawaiian Pizza',
    'PIZZA004': 'BBQ Chicken Pizza',
    'PIZZA005': 'Veggie Supreme Pizza',
    'PIZZA006': 'Meat Lovers Pizza',
    'PIZZA007': 'Buffalo Chicken Pizza',
    'PIZZA008': 'Supreme Pizza',
    'PIZZA009': 'Cheese Pizza',
    'PIZZA010': 'Spinach & Feta Pizza',
    // Add more mappings as needed
  };
  
  return skuToName[product] || product;
};

// fetchProductRanking gibt [{ product, orders, rankNow, rankBefore, trend }]
export default function ProductLeaderboard({ ranking, storeFilter }) {
  console.log('ProductLeaderboard received ranking:', ranking); // Debug log
  
  const data = ranking.map(x => ({
    label: formatProductName(x.product),
    value: x.orders,
    trend: x.trend,
    rankBefore: x.rankBefore,
  }));
  
  const title = storeFilter 
    ? `Top 5 Produkte - ${storeFilter} (mit Trend)`
    : "Top 5 Produkte (mit Trend)";
    
  return (
    <Leaderboard
      data={data}
      title={title}
      TrendIcon={TrendIcon}
      showRankBefore
    />
  );
}
