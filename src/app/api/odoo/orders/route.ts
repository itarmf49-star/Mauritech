import { odooRequest } from "@/lib/odoo/client";


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
        {
          status: 400,
        }
      );

    }



    /*
      جلب بيانات العميل
      سيتم ربطها مع المستخدم لاحقاً
      بدون كسر الصفحة الآن
    */

    const customerEmail = "guest@mauritech.tech";
    const customerName = "Guest Customer";



    /*
      البحث عن العميل في Odoo
    */

    const partners = await odooRequest(
      "res.partner",
      "search_read",
      [
        [
          [
            "email",
            "=",
            customerEmail
          ]
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



    if (partners.length > 0) {

      partnerId = partners[0].id;


    } else {


      partnerId = await odooRequest(
        "res.partner",
        "create",
        [
          {
            name: customerName,

            email: customerEmail,

            customer_rank: 1,

          }
        ]
      );


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
          ],
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



  } catch (error:any) {


    console.error(
      "Odoo order error:",
      error
    );


    return Response.json(
      {
        success:false,

        error:
          error?.message ||
          String(error),

      },
      {
        status:500,
      }
    );


  }

}
