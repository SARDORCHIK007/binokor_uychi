import { useTranslation } from "react-i18next";
import { useList } from "../hooks/useList";

/** Tartib `gallery.items` (sarlavhalar) bilan bir xil. Fayllar: `public/gallery/`. */
const PHOTOS = ["/gallery/welding.webp", "/gallery/concrete.webp", "/gallery/site.webp", "/gallery/lift.webp"];

/** Zamonaviy qurilish ishlaridan suratlar (fon videosidan olingan kadrlar), to'q ko'k fonda. */
export function Gallery() {
  const { t } = useTranslation();
  const captions = useList<string>("gallery.items");

  return (
    <section id="gallery" aria-labelledby="gallery-title" className="bg-brand-700 py-14 text-white lg:py-20">
      <div className="container-content">
        <div className="mb-8 max-w-3xl lg:mb-10">
          <p className="font-heading text-[12px] font-bold uppercase tracking-[0.1em] text-gold">{t("gallery.kicker")}</p>
          <h2 id="gallery-title" className="mt-1 border-l-4 border-gold pl-4 text-h2 !text-white lg:text-h2-lg">
            {t("gallery.title")}
          </h2>
          <p className="mt-4 text-white/80 lg:text-[17px]">{t("gallery.intro")}</p>
        </div>

        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {captions.map((caption, i) => {
            const src = PHOTOS[i];
            if (!src) return null;
            return (
              <li key={caption}>
                <figure className="group relative overflow-hidden rounded-card bg-[#061F36]">
                  <img
                    src={src}
                    width={960}
                    height={432}
                    loading="lazy"
                    alt={caption}
                    className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                  <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#061F36]/90 to-transparent px-4 pb-4 pt-10 font-heading text-[16px] font-bold text-white">
                    {caption}
                  </figcaption>
                </figure>
              </li>
            );
          })}
        </ul>
        <p className="mt-4 text-[13px] text-white/60">{t("gallery.note")}</p>
      </div>
    </section>
  );
}
