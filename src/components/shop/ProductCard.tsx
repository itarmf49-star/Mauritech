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
  store-glass
  rounded-3xl
  overflow-hidden
  border
  border-white/10
  shadow-2xl
  hover:border-cyan-400/40
  transition-all
  duration-500
  hover:-translate-y-2
"

>



      className="
  h-64
  bg-black/20
  flex
  items-center
  justify-center
  overflow-hidden
  relative
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
 p-8
 group-hover:scale-110
 transition-transform
 duration-700
 drop-shadow-2xl
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





     <div className="p-5 bg-black/10">



        <h2

          className="
            text-xl
            font-bold
            text-white
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
              text-cyan-300
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
            text-gray-300
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
