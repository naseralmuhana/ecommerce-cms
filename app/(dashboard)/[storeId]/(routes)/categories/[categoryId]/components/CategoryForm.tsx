"use client"

import axios from "axios"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Billboard, Category } from "@prisma/client"
import { toast } from "react-hot-toast"
import { useParams, useRouter } from "next/navigation"

import useLoading from "@/hooks/useLoading"
import useOpen from "@/hooks/useOpen"
import { InputField } from "@/components/ui/input-field"
import { categoryFormSchema } from "@/lib/form-schema"
import { FormLayout } from "@/components/FormLayout"
import SelectField from "@/components/ui/select-field"

type CategoryFormProps = {
  initialData: Category | null
  billboards: Billboard[]
}

const deleteErrorMessage =
  "Make sure you removed all products using this category first."

export default function CategoryForm({
  initialData,
  billboards,
}: CategoryFormProps) {
  const router = useRouter()
  const params = useParams()

  const setLoading = useLoading((state) => state.setLoading)
  const setOpen = useOpen((state) => state.setOpen)

  const toastMessage = !!initialData ? "Category updated." : "Category created."

  const form = useForm<FormValuesType>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: initialData || { name: "", billboardId: "" },
  })

  const handleFormSubmit = async (values: FormValuesType) => {
    try {
      setLoading(true)
      const { name, billboardId } = values
      const { storeId, categoryId } = params
      if (initialData) {
        if (
          name !== initialData.name ||
          billboardId !== initialData.billboardId
        ) {
          await axios.patch(`/api/${storeId}/categories/${categoryId}`, values)
        }
      } else {
        await axios.post(`/api/${storeId}/categories`, values)
      }
      router.push(`/${storeId}/categories`)
      router.refresh()
      toast.success(toastMessage)
    } catch (error) {
      toast.error("Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      setLoading(true)
      const { storeId, categoryId } = params
      await axios.delete(`/api/${storeId}/categories/${categoryId}`)
      router.push(`/${storeId}/categories`)
      toast.success("Category deleted.")
      router.refresh()
    } catch (error) {
      toast.error(deleteErrorMessage)
    } finally {
      setLoading(false)
      setOpen(false)
    }
  }

  return (
    <FormLayout
      form={form}
      handleDelete={handleDelete}
      handleFormSubmit={handleFormSubmit}
      isInitialData={!!initialData}
      formTitle="category"
    >
      <div className="grid grid-cols-3 gap-8">
        <InputField
          name="name"
          control={form.control}
          placeholder="Category name"
        />
      </div>
      <div className="grid grid-cols-3 gap-8">
        <SelectField
          data={billboards}
          label="Billboard"
          name="billboardId"
          placeholder="Select a billboard"
          control={form.control}
        />
      </div>
    </FormLayout>
  )
}
