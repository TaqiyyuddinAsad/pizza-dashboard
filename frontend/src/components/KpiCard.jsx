
export function KpiCard({ title, percentage, price, icon, bgColor, accentColor, titleStyle = {}, valueStyle = {} }) {
  return (
    <div className={`rounded-2xl shadow p-7 flex flex-col justify-between aspect-square min-h-[180px] ${bgColor}`}>
      <div className="flex items-center justify-between w-full">
        <span className="text-lg font-bold" style={{ color: accentColor, ...titleStyle }}>
          {title}
        </span>
        <div className="flex items-center gap-1">
          {icon}
          <span className="text-base font-semibold" style={{ color: accentColor }}>
            {percentage}
          </span>
        </div>
      </div>
      <div className="text-4xl font-extrabold mt-6" style={{ color: accentColor, ...valueStyle }}>
        {price}
      </div>
    </div>
  );
}
