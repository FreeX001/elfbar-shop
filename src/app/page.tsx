import { listSeriesWithProducts } from "@/lib/db";
import HomeHero from "@/components/HomeHero";
import SeriesCard from "@/components/SeriesCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const series = await listSeriesWithProducts();

  return (
    <div>
      <HomeHero />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 mt-10">
        {series.map((s) => (
          <SeriesCard key={s.id} series={s} />
        ))}
      </div>
      {series.length === 0 && (
        <p className="text-center text-white/40 mt-20">
          Каталог поки порожній. Додайте товари через адмін-панель /admin.
        </p>
      )}
    </div>
  );
}
