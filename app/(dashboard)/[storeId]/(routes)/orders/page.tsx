import { format } from "date-fns"

import prismadb from "@/lib/prismadb"
import { ordersColumns } from "@/components/columns/orders-columns"
import { formatter } from "@/lib/utils"
import { Heading } from "@/components/ui/heading"
import { DataTable } from "@/components/ui/data-table"

interface OrderPagesProps {
  params: { storeId: string }
}

const OrdersPage: React.FC<OrderPagesProps> = async ({ params }) => {
  const orders = await prismadb.order.findMany({
    where: { storeId: params.storeId },
    include: { products: { include: { product: true } } },
    orderBy: { updatedAt: "desc" },
  })

  const formattedOrders: OrderColumnsType[] = orders.map((order) => ({
    id: order.id,
    phone: order.phone,
    address: order.address,
    isPaid: order.isPaid,
    product: order.products.map((product) => product.product.name).join(", "),
    totalPrice: formatter.format(
      order.products.reduce((total, product) => {
        return total + Number(product.product.price)
      }, 0)
    ),
    updatedAt: format(order.updatedAt, "kk:mm MMMM do, yyyy"),
  }))

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <Heading title="Orders" description="Manage orders for your store" />
        </div>
        <DataTable
          columns={ordersColumns}
          data={formattedOrders}
          apiPathToDeleteMany="orders"
        />
      </div>
    </div>
  )
}
export default OrdersPage
