type ShopHeroProps = {
  locale?: string;
};

export default function ShopHero({
  locale,
}: ShopHeroProps) {

  return (

    <section
      className="
        relative
        overflow-hidden
        rounded-3xl
        mb-16
        border
        border-white/10
        bg-black/40
        backdrop-blur-xl
        shadow-2xl
      "
    >

      {/* Network Background */}

      <div
        className="
          absolute
          inset-0
          opacity-30
          pointer-events-none
          network-lines
        "
      />


      <div
        className="
          relative
          z-10
          grid
          md:grid-cols-2
          gap-10
          p-8
          md:p-14
          items-center
        "
      >


        {/* Text */}

        <div>


          <div
            className="
              inline-flex
              px-4
              py-2
              rounded-full
              bg-cyan-400/10
              border
              border-cyan-400/30
              text-cyan-300
              text-sm
              font-semibold
              mb-6
            "
          >

            Mauritech Network Store

          </div>



          <h1
            className="
              text-4xl
              md:text-6xl
              font-black
              text-white
              leading-tight
            "
          >

            Professional

            <span className="text-cyan-400">
              {" "}Network Solutions
            </span>

          </h1>



          <p
            className="
              mt-6
              text-lg
              text-gray-300
              max-w-xl
            "
          >

            Professional networking equipment,
            Wi-Fi devices and infrastructure
            solutions for homes, businesses
            and enterprises.

          </p>



          <div
            className="
              flex
              flex-wrap
              gap-4
              mt-8
            "
          >

            <a
              href="#products"
              className="
                px-7
                py-3
                rounded-full
                bg-cyan-400
                text-black
                font-bold
                hover:scale-105
                transition
              "
            >
              Shop Products
            </a>



            <a
              href="/contact"
              className="
                px-7
                py-3
                rounded-full
                border
                border-white/20
                text-white
                hover:bg-white/10
                transition
              "
            >
              Contact Us
            </a>


          </div>


        </div>




        {/* Stats Panel */}


        <div
          className="
            grid
            grid-cols-2
            gap-4
          "
        >


          {[
            {
              value:"50+",
              label:"Network Products"
            },
            {
              value:"24/7",
              label:"Technical Support"
            },
            {
              value:"Fiber",
              label:"Optic Solutions"
            },
            {
              value:"Enterprise",
              label:"Infrastructure"
            }
          ].map((item)=>(

            <div
              key={item.label}
              className="
                rounded-2xl
                p-6
                bg-white/5
                border
                border-white/10
                backdrop-blur
                hover:border-cyan-400/40
                transition
              "
            >

              <div
                className="
                  text-2xl
                  font-black
                  text-white
                "
              >
                {item.value}
              </div>


              <div
                className="
                  mt-2
                  text-gray-400
                  text-sm
                "
              >
                {item.label}
              </div>


            </div>

          ))}


        </div>


      </div>


    </section>

  );
}
