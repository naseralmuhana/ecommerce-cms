"use client"

import axios from "axios"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Billboard } from "@prisma/client"
import { toast } from "react-hot-toast"
import { useParams, useRouter } from "next/navigation"

import useLoading from "@/hooks/useLoading"
import useOpen from "@/hooks/useOpen"
import { InputField } from "@/components/ui/input-field"
import BillboardImageField from "./fields/BillboardImageField"
import { billboardFormSchema } from "@/lib/form-schema"
import { FormLayout } from "@/components/FormLayout"

type BillboardFormProps = { initialData: Billboard | null }

const deleteErrorMessage =
  "Make sure you removed all categories using this billboard first."

export default function BillboardForm({ initialData }: BillboardFormProps) {
  const router = useRouter()
  const params = useParams()

  const setLoading = useLoading((state) => state.setLoading)
  const setOpen = useOpen((state) => state.setOpen)

  const toastMessage = !!initialData
    ? "Billboard updated."
    : "Billboard created."

  const form = useForm<FormValuesType>({
    resolver: zodResolver(billboardFormSchema),
    defaultValues: initialData || { label: "", imageUrl: "" },
  })

  const handleFormSubmit = async (values: FormValuesType) => {
    try {
      setLoading(true)
      const { label, imageUrl } = values
      const { storeId, billboardId } = params
      if (initialData) {
        if (label !== initialData.label || imageUrl !== initialData.imageUrl) {
          await axios.patch(`/api/${storeId}/billboards/${billboardId}`, values)
        }
      } else {
        await axios.post(`/api/${storeId}/billboards`, values)
      }
      router.push(`/${storeId}/billboards`)
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
      const { storeId, billboardId } = params
      await axios.delete(`/api/${storeId}/billboards/${billboardId}`)
      router.push(`/${storeId}/billboards`)
      router.refresh()
      toast.success("Billboard deleted.")
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
      formTitle="billboard"
    >
      <BillboardImageField control={form.control} />
      <div className="grid grid-cols-3 gap-8">
        <InputField
          control={form.control}
          name="label"
          placeholder="Billboard label"
        />
      </div>
    </FormLayout>
  )
}
