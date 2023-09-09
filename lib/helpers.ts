import type { ProductFormProps } from "@/app/(dashboard)/[storeId]/(routes)/products/[productId]/components/@types"
import { FormLayoutProps } from "@/components/FormLayout"

export const formStaticData = (
  data: boolean,
  page: FormLayoutProps["formTitle"]
) => {
  if (page === "settings")
    return {
      title: "Settings",
      description: "Manage store preferences",
      action: "Save changes",
    }
  const title = data ? `Edit ${page}` : `Create ${page}`
  const description = data ? `Edit a ${page}` : `Add a new ${page}`
  const toastMessage = data ? `${page} updated.` : `${page} created.`
  const action = data ? `Save changes` : `Create`

  return { title, description, toastMessage, action }
}

//------------------------------------------------------------
//------------------------------------------------------------
//------------------------------------------------------------
// Define constants for error messages
const errorMessages = {
  billboards:
    "Make sure you removed all categories using the selected billboard(s) first.",
  categories:
    "Make sure you removed all products using the selected category(s) first.",
  sizes: "Make sure you removed all products using the selected size(s) first.",
  colors:
    "Make sure you removed all products using the selected color(s) first.",

  orders: "Something went wrong.",
  products: "Something went wrong.",
}

// Function to get the error message based on the action type
export const cellActionDeleteErrorMessage = (
  path: keyof typeof errorMessages // Use keyof to restrict type to the defined error message keys
) => {
  // Return the appropriate error message based on the action type
  return errorMessages[path] || errorMessages.products
}
//------------------------------------------------------------
//------------------------------------------------------------
//------------------------------------------------------------
// Define constants for success messages
const successMessages = {
  billboards: "Billboard deleted.",
  categories: "Category deleted.",
  sizes: "Size deleted.",
  colors: "Color deleted.",
  products: "Product deleted.",
  orders: "Order deleted.",
}

// Function to get the success message based on the action path
export const cellActionDeleteSuccessMessage = (
  path: keyof typeof successMessages // Use keyof to restrict type to the defined success message keys
) => {
  // Return the appropriate success message based on the action path
  return successMessages[path] || successMessages.products
}
//------------------------------------------------------------
//------------------------------------------------------------
//------------------------------------------------------------

export const formattedProductInitialData = (
  initialData: ProductFormProps["initialData"]
) => {
  return {
    ...initialData,
    price: parseFloat(String(initialData?.price)),
    sizes: initialData?.sizes.map((size) => ({
      id: size.sizeId,
    })),
    categories: initialData?.categories.map((category) => ({
      id: category.categoryId,
    })),
    colors: initialData?.colors.map((color) => ({
      id: color.colorId,
    })),
  }
}
