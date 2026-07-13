import type { Locale } from "@/lib/i18n";


type ShopHeroProps = {
  locale: Locale;
};


export default function ShopHero({
  locale,
}: ShopHeroProps) {


  const content = {

    ar: {
      title: "متجر Mauritech",
      subtitle:
        "معدات الشبكات والواي فاي والبنية التحتية الاحترافية",
      badge1: "Wi-Fi Solutions",
      badge2: "Network Equipment",
      badge3: "Fiber Optic",
      badge4: "Enterprise Networks",
      button:
        "تصفح المنتجات",
    },


    fr: {
      title: "Boutique Mauritech",
      subtitle:
        "Équipements réseau, Wi-Fi et solutions d'infrastructure professionnelles",
      badge1: "Solutions Wi-Fi",
      badge2: "Équipements réseau",
      badge3: "Fibre optique",
      badge4: "Réseaux entreprise",
      button:
        "Voir les produits",
    },


    en: {
      title: "Mauritech Store",
      subtitle:
        "Professional networking equipment, Wi-Fi devices and infrastructure solutions",
      badge1: "Wi-Fi Solutions",
      badge2: "Network Equipment",
      badge3: "Fiber Optic",
      badge4: "Enterprise Networks",
      button:
        "Browse Products",
    },

  };


  const text = content[locale];



  return (

    <section
      className="
        relative
        overflow-hidden
        rounded-3xl
        min-h-[520px]
        mb-16
        bg-[#071426]
        text-white
      "
    >


      {/* Background */}

      <div
        className="
          absolute
          inset-0
          bg-[radial-gradient(circle_at_top_right,_#2563eb,_transparent_40%)]
        "
      />


      <div
        className="
          absolute
          inset-0
          opacity-30
          bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,.15)_50%,transparent_100%)]
          animate-pulse
        "
      />



      <div
        className="
          relative
          z-10
          flex
          flex-col
          justify-center
          h-full
          min-h-[520px]
          p-8
          md:p-16
        "
      >



        <span
          className="
            inline-block
            w-fit
            px-4
            py-2
            rounded-full
            bg-blue-600/30
            border
            border-blue-400/30
            mb-6
          "
        >

          Mauritech Network Store

        </span>





        <h1
          className="
            text-4xl
            md:text-6xl
            font-bold
            max-w-3xl
            leading-tight
          "
        >

          {text.title}

        </h1>




        <p
          className="
            mt-6
            text-lg
            md:text-xl
            text-gray-300
            max-w-2xl
          "
        >

          {text.subtitle}

        </p>





        <div
          className="
            flex
            flex-wrap
            gap-3
            mt-8
          "
        >


          {[

            text.badge1,
            text.badge2,
            text.badge3,
            text.badge4,

          ].map((item)=>(

            <span

              key={item}

              className="
                px-4
                py-2
                rounded-xl
                bg-white/10
                backdrop-blur
                border
                border-white/10
                text-sm
              "

            >

              {item}

            </span>

          ))}


        </div>





      </div>



    </section>

  );

}
