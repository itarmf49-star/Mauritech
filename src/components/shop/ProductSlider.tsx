import ProductCard from "@/components/shop/ProductCard";


type ProductSliderProps = {
  products: any[];
};



export default function ProductSlider({
  products,
}: ProductSliderProps) {


  if (!products || products.length === 0) {

    return null;

  }



  return (

    <section
      className="
        mb-16
      "
    >


      <div
        className="
          flex
          items-center
          justify-between
          mb-6
        "
      >

        <div>

          <h2
            className="
              text-3xl
              font-bold
              text-gray-900
            "
          >

            Featured Products

          </h2>


          <p
            className="
              text-gray-600
              mt-2
            "
          >

            Latest networking equipment from Mauritech stock

          </p>


        </div>


      </div>





      <div

        className="
          overflow-hidden
          relative
        "

      >



        <div

          className="
            flex
            gap-6
            animate-[slide_25s_linear_infinite]
            hover:[animation-play-state:paused]
            w-max
          "

        >



          {[

            ...products,
            ...products,

          ].map((product, index)=>(


            <div

              key={`${product.id}-${index}`}

              className="
                w-[300px]
                flex-shrink-0
              "

            >

              <ProductCard

                product={product}

              />


            </div>


          ))}



        </div>



      </div>




      <style jsx>{`

        @keyframes slide {

          from {

            transform: translateX(0);

          }


          to {

            transform: translateX(-50%);

          }

        }


      `}</style>



    </section>

  );

}
