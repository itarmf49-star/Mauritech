import Link from "next/link";
import type { Locale } from "@/lib/i18n";


type ShopCtaProps = {
  locale: Locale;
};


export function ShopCta({
  locale,
}: ShopCtaProps) {


  const content = {

    ar: {
      title: "متجر Mauritech",
      description:
        "اكتشف معدات الشبكات والواي فاي والأجهزة الاحترافية المتوفرة لدينا.",
      button:
        "تصفح المتجر",
    },


    fr: {
      title: "Boutique Mauritech",
      description:
        "Découvrez nos équipements réseau, Wi-Fi et solutions professionnelles.",
      button:
        "Voir la boutique",
    },


    en: {
      title: "Mauritech Store",
      description:
        "Explore networking equipment, Wi-Fi devices and professional solutions.",
      button:
        "Visit Store",
    },

  };


  const text = content[locale];



  return (

    <section
      className="
        py-16
        px-6
      "
    >

      <div
        className="
          max-w-6xl
          mx-auto
          rounded-3xl
          bg-[#0B1220]
          text-white
          p-10
          text-center
        "
      >

        <h2
          className="
            text-3xl
            font-bold
            mb-4
          "
        >
          {text.title}
        </h2>


        <p
          className="
            text-gray-300
            mb-8
          "
        >
          {text.description}
        </p>


        <Link

          href={`/${locale}/shop`}

          className="
            inline-block
            bg-blue-600
            hover:bg-blue-700
            px-8
            py-3
            rounded-xl
            font-semibold
          "

        >

          {text.button}

        </Link>


      </div>


    </section>

  );

}
