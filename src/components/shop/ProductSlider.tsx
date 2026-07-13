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


      <div className="mb-8">


        <h2
          className="
            text-3xl
            md:text-4xl
            font-bold
            text-white
          "
        >

          Latest Products

        </h2>


        <p
          className="
            text-gray-300
            mt-2
          "
        >

          New networking equipment from Mauritech inventory

        </p>


      </div>



      <div
        className="
          relative
          overflow-hidden
          rounded-3xl
          border
          border-white/10
          bg-black/20
          backdrop-blur
          py-6
        "
      >



        <div
          className="
 product-track
 gap-6
"
        >


          {[...products, ...products].map(
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

          )}


        </div>


      </div>


    </section>

  );

}
