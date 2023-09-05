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
    "Make sure you removed all categories using this billboard first.",
  categories: "Make sure you removed all products using this category first.",
  sizes: "Make sure you removed all products using this size first.",
  colors: "Make sure you removed all products using this color first.",
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
