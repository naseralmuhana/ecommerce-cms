"use client"

import axios from "axios"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "react-hot-toast"
import { useParams, useRouter } from "next/navigation"

import type { ProductFormProps } from "./@types"

import useLoading from "@/hooks/useLoading"
import useOpen from "@/hooks/useOpen"
import { CheckBoxField } from "./fields/CheckBoxField"
import { MultiSelect } from "./fields/MultiSelect"
import { InputField } from "@/components/ui/input-field"
import { productFormSchema } from "@/lib/form-schema"
import { FormLayout } from "@/components/FormLayout"
import { FormField } from "@/components/ui/form"
import { FormFieldItem } from "@/components/ui/form-field-item"
import { UploadImageField } from "./fields/UploadImageField"
import { formattedProductInitialData } from "@/lib/helpers"

const defaults = {
  name: "",
  price: 0,
  isFeatured: false,
  isArchived: false,
  categories: [],
  sizes: [],
  colors: [],
  images: [],
}

const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  categories,
  sizes,
  colors,
}) => {
  const router = useRouter()
  const params = useParams()

  const setLoading = useLoading((state) => state.setLoading)
  const setOpen = useOpen((state) => state.setOpen)

  const toastMessage = !!initialData ? "Product updated." : "Product created."

  const form = useForm<FormValuesType>({
    resolver: zodResolver(productFormSchema),
    defaultValues: initialData
      ? formattedProductInitialData(initialData)
      : defaults,
  })

  const handleFormSubmit = async (values: FormValuesType) => {
    try {
      setLoading(true)
      const { storeId, productId } = params
      if (initialData) {
        await axios.patch(`/api/${storeId}/products/${productId}`, values)
      } else {
        await axios.post(`/api/${storeId}/products`, values)
      }
      router.push(`/${storeId}/products`)
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
      const { storeId, productId } = params
      await axios.delete(`/api/${storeId}/products/${productId}`)
      router.push(`/${storeId}/products`)
      toast.success("Product deleted.")
      router.refresh()
    } catch (error) {
      toast.error("Something went wrong.")
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
      formTitle="product"
    >
      <UploadImageField control={form.control} />
      <div className="grid grid-cols-3 gap-8">
        <InputField
          control={form.control}
          name="name"
          placeholder="Product name"
        />
        <InputField
          control={form.control}
          name="price"
          placeholder="Product price"
        />
      </div>
      <div className="grid grid-cols-3 gap-8">
        <FormField
          control={form.control}
          name="categories"
          render={({ field }) => (
            <FormFieldItem label="Categories">
              <MultiSelect
                data={categories}
                placeholder="categories"
                field={field}
              />
            </FormFieldItem>
          )}
        />
        <FormField
          control={form.control}
          name="sizes"
          render={({ field }) => (
            <FormFieldItem label="Sizes">
              <MultiSelect data={sizes} placeholder="sizes" field={field} />
            </FormFieldItem>
          )}
        />
        <FormField
          control={form.control}
          name="colors"
          render={({ field }) => (
            <FormFieldItem label="Colors">
              <MultiSelect data={colors} placeholder="colors" field={field} />
            </FormFieldItem>
          )}
        />
      </div>
      <div className="grid grid-cols-3 gap-8">
        <CheckBoxField control={form.control} name="isFeatured" />
        <CheckBoxField control={form.control} name="isArchived" />
      </div>
    </FormLayout>
  )
}

export default ProductForm
