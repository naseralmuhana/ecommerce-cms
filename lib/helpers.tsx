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
