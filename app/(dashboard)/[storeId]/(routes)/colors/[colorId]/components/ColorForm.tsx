"use client"

import axios from "axios"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Color } from "@prisma/client"
import { toast } from "react-hot-toast"
import { useParams, useRouter } from "next/navigation"

import useLoading from "@/hooks/useLoading"
import useOpen from "@/hooks/useOpen"
import { colorFormSchema } from "@/lib/form-schema"
import { InputField } from "@/components/ui/input-field"
import ValueField from "./fields/ValueField"
import { FormLayout } from "@/components/FormLayout"

type ColorFormProps = { initialData: Color | null }

const deleteErrorMessage =
  "Make sure you removed all products using this color first."

export default function ColorForm({ initialData }: ColorFormProps) {
  const router = useRouter()
  const params = useParams()

  const setLoading = useLoading((state) => state.setLoading)
  const setOpen = useOpen((state) => state.setOpen)

  const toastMessage = !!initialData ? "Color updated." : "Color created."

  const form = useForm<FormValuesType>({
    resolver: zodResolver(colorFormSchema),
    defaultValues: initialData || { name: "", value: "" },
  })

  const handleFormSubmit = async (values: FormValuesType) => {
    try {
      setLoading(true)
      const { name, value } = values
      const { storeId, colorId } = params
      if (initialData) {
        if (name !== initialData.name || value !== initialData.value) {
          await axios.patch(`/api/${storeId}/colors/${colorId}`, values)
        }
      } else {
        await axios.post(`/api/${storeId}/colors`, values)
      }
      router.push(`/${storeId}/colors`)
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
      const { storeId, colorId } = params
      await axios.delete(`/api/${storeId}/colors/${colorId}`)
      router.push(`/${storeId}/colors`)
      toast.success("Color deleted.")
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
      formTitle="color"
    >
      <div className="grid grid-cols-3 gap-8">
        <InputField
          name="name"
          control={form.control}
          placeholder="Color name"
        />
      </div>
      <div className="grid grid-cols-3 gap-8">
        <ValueField control={form.control} />
      </div>
    </FormLayout>
  )
}
