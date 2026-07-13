import BuyButton from "@/components/shop/BuyButton";


type ProductCardProps = {
  product: {
    id: number;
    name: string;
    list_price: number;
    image_1920?: string | null;
    qty_available?: number;
  };
};



export default function ProductCard({
  product,
}: ProductCardProps) {


  return (

    <div

      className="
        group
        bg-white
        rounded-2xl
        overflow-hidden
        border
        shadow-sm
        hover:shadow-xl
        transition-all
        duration-300
        hover:-translate-y-1
      "

    >



      <div

        className="
          h-64
          bg-gray-50
          flex
          items-center
          justify-center
          overflow-hidden
        "

      >

        {product.image_1920 ? (

          <img

            src={`data:image/png;base64,${product.image_1920}`}

            alt={product.name}

            className="
              w-full
              h-full
              object-contain
              p-6
              group-hover:scale-110
              transition-transform
              duration-500
            "

          />

        ) : (

          <div

            className="
              text-gray-400
              text-sm
            "

          >

            No Image

          </div>

        )}

      </div>





      <div className="p-5">



        <h2

          className="
            text-xl
            font-bold
            text-gray-900
            line-clamp-2
            min-h-[56px]
          "

        >

          {product.name}

        </h2>





        <div

          className="
            mt-4
            flex
            items-center
            justify-between
          "

        >

          <span

            className="
              text-2xl
              font-bold
              text-blue-700
            "

          >

            {product.list_price}

            <span className="text-sm ml-1">

              MRU

            </span>


          </span>



        </div>





        <div

          className="
            mt-3
            text-sm
            text-gray-500
          "

        >

          Stock:

          {" "}

          <span className="font-semibold">

            {product.qty_available ?? 0}

          </span>


        </div>





        <div className="mt-5">

          <BuyButton

            productId={product.id}

          />

        </div>




      </div>



    </div>

  );

}
