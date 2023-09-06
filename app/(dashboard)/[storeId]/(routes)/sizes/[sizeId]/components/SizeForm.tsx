"use client"

import axios from "axios"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Size } from "@prisma/client"
import { toast } from "react-hot-toast"
import { useParams, useRouter } from "next/navigation"

import useLoading from "@/hooks/useLoading"
import useOpen from "@/hooks/useOpen"
import { InputField } from "@/components/ui/input-field"
import { sizeFormSchema } from "@/lib/form-schema"
import { FormLayout } from "@/components/FormLayout"

type SizeFormProps = { initialData: Size | null }

const deleteErrorMessage =
  "Make sure you removed all products using this size first."

export default function SizeForm({ initialData }: SizeFormProps) {
  const router = useRouter()
  const params = useParams()

  const setLoading = useLoading((state) => state.setLoading)
  const setOpen = useOpen((state) => state.setOpen)

  const toastMessage = !!initialData ? "Size updated." : "Size created."

  const form = useForm<FormValuesType>({
    resolver: zodResolver(sizeFormSchema),
    defaultValues: initialData || { name: "", value: "" },
  })

  const handleFormSubmit = async (values: FormValuesType) => {
    try {
      setLoading(true)
      const { name, value } = values
      const { storeId, sizeId } = params
      if (initialData) {
        if (name !== initialData.name || value !== initialData.value) {
          await axios.patch(`/api/${storeId}/sizes/${sizeId}`, values)
        }
      } else {
        await axios.post(`/api/${storeId}/sizes`, values)
      }
      router.push(`/${storeId}/sizes`)
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
      const { storeId, sizeId } = params
      await axios.delete(`/api/${storeId}/sizes/${sizeId}`)
      router.push(`/${storeId}/sizes`)
      toast.success("Size deleted.")
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
      formTitle="size"
    >
      <div className="grid grid-cols-3 gap-8">
        <InputField
          control={form.control}
          name="name"
          placeholder="Size name"
        />
      </div>
      <div className="grid grid-cols-3 gap-8">
        <InputField
          control={form.control}
          name="value"
          placeholder="Size value"
        />
      </div>
    </FormLayout>
  )
}
