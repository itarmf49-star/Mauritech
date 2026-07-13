import { odooRequest } from "@/lib/odoo/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";


export async function GET() {

  return Response.json({
    success: true,
    message: "Orders API is running",
  });

}



export async function POST(request: Request) {

  try {


    const body = await request.json();


    const {
      product_id,
      quantity = 1,
    } = body;



    if (!product_id) {

      return Response.json(
        {
          success: false,
          error: "product_id is required",
        },
        { status: 400 }
      );

    }



    /*
      الحصول على المستخدم الحالي
    */

    const session = await getServerSession(
      authOptions
    );



    if (!session?.user?.email) {

      return Response.json(
        {
          success: false,
          error: "User not authenticated",
        },
        { status: 401 }
      );

    }



    const email = session.user.email;



    /*
      البحث عن العميل في Odoo
    */

    let partners = await odooRequest(
      "res.partner",
      "search_read",
      [
        [
          ["email", "=", email]
        ],
        {
          fields: [
            "id",
            "name",
            "email"
          ],
          limit: 1,
        },
      ]
    );



    let partnerId;



    /*
      إذا العميل غير موجود ننشئه
    */

    if (!partners.length) {


      partnerId = await odooRequest(
        "res.partner",
        "create",
        [
          {
            name:
              session.user.name ||
              email,

            email,

            customer_rank: 1,

          },
        ]
      );


    } else {


      partnerId = partners[0].id;


    }




    /*
      إنشاء طلب البيع
    */

    const orderId = await odooRequest(
      "sale.order",
      "create",
      [
        {

          partner_id: partnerId,


          order_line: [

            [
              0,
              0,
              {

                product_id,

                product_uom_qty: quantity,

              }
            ]

          ]

        }
      ]
    );




    return Response.json({

      success: true,

      orderId,

      partnerId,

      message:
        "Order created successfully",

    });



  } catch (error: any) {


    console.error(
      "Odoo order error:",
      error
    );



    return Response.json(

      {
        success: false,
        error:
          error?.message ||
          String(error),
      },

      {
        status: 500
      }

    );


  }

}
