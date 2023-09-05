"use client"

import axios from "axios"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Store } from "@prisma/client"
import { toast } from "react-hot-toast"
import { useParams, useRouter } from "next/navigation"

import useOrigin from "@/hooks/useOrigin"
import useOpen from "@/hooks/useOpen"
import useLoading from "@/hooks/useLoading"
import { Separator } from "@/components/ui/separator"
import { ApiAlert } from "@/components/ui/api-alert"
import { InputField } from "@/components/ui/input-field"
import { settingsFormSchema } from "@/lib/form-schema"
import { FormLayout } from "@/components/FormLayout"

interface SettingsFormProps {
  initialData: Store
}

const deleteErrorMessage =
  "Make sure you removed all products and categories that are related to this store first."

export default function SettingsForm({ initialData }: SettingsFormProps) {
  const router = useRouter()
  const params = useParams()
  const origin = useOrigin()

  const setOpen = useOpen((state) => state.setOpen)
  const setLoading = useLoading((state) => state.setLoading)

  const form = useForm<FormValuesType>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: initialData,
  })

  const handleFormSubmit = async (values: FormValuesType) => {
    try {
      setLoading(true)
      if (values.name !== initialData.name) {
        await axios.patch(`/api/stores/${params.storeId}`, values)
        router.refresh()
      }
      toast.success("Store updated.")
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      setLoading(true)
      await axios.delete(`/api/stores/${params.storeId}`)
      router.push("/")
      router.refresh()
      toast.success("Store deleted.")
    } catch (error) {
      toast.error(deleteErrorMessage)
    } finally {
      setOpen(false)
      setLoading(false)
    }
  }

  return (
    <>
      <FormLayout
        form={form}
        handleDelete={handleDelete}
        handleFormSubmit={handleFormSubmit}
        isInitialData={!!initialData}
        formTitle="settings"
      >
        <div className="grid grid-cols-3 gap-8">
          <InputField
            control={form.control}
            name="name"
            placeholder="Store name"
          />
        </div>
      </FormLayout>
      <Separator />
      <ApiAlert
        title="NEXT_PUBLIC_API_URL"
        description={`${origin}/api/${params.storeId}`}
        variant="public"
      />
    </>
  )
}
