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

    <section className="mb-16">


      <div className="mb-6">

        <h2
          className="
            text-3xl
            font-bold
            text-gray-900
          "
        >
          Featured Products
        </h2>


        <p className="text-gray-600 mt-2">
          Latest networking equipment from Mauritech stock
        </p>

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
            w-max
            animate-scroll
            hover:[animation-play-state:paused]
          "
        >


          {
            [...products, ...products].map(
              (product, index) => (

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

              )
            )
          }


        </div>


      </div>


    </section>

  );

}
