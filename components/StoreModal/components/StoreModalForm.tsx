"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import axios from "axios"
import { useRouter } from "next/navigation"

import useStoreModal from "@/hooks/useStoreModal"
import useLoading from "@/hooks/useLoading"
import { Form } from "@/components/ui/form"
import { LoaderButton } from "@/components/ui/button-loader"
import { Button } from "@/components/ui/button"
import { InputField } from "@/components/ui/input-field"
import { createStoreFormSchema } from "@/lib/form-schema"

const StoreModalForm = () => {
  const router = useRouter()

  const onClose = useStoreModal((state) => state.onClose)
  const { loading, setLoading } = useLoading()

  const form = useForm<FormValuesType>({
    resolver: zodResolver(createStoreFormSchema),
    defaultValues: { name: "" },
  })

  const onSubmit = async (values: FormValuesType) => {
    try {
      setLoading(true)
      const response = await axios.post("/api/stores", values)
      const { storesCount, id, name } = response.data
      if (storesCount > 1) {
        router.push(`/${id}`)
        onClose()
        router.refresh()
      } else {
        window.location.assign(`/${id}`)
      }
      toast.success(`Store created.`)
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4 py-2 pb-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <InputField
            control={form.control}
            name="name"
            placeholder="Store name"
          />
          <div className="pt-6 space-x-2 flex items-center justify-end w-full">
            <Button
              variant="outline"
              type="button"
              disabled={loading}
              onClick={onClose}
            >
              Cancel
            </Button>
            <LoaderButton text="Continue" />
          </div>
        </form>
      </Form>
    </div>
  )
}
export default StoreModalForm
