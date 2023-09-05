"use client"

import { UseFormReturn } from "react-hook-form"

import { Form } from "@/components/ui/form"
import { LoaderButton } from "@/components/ui/button-loader"
import { formStaticData } from "@/lib/helpers"
import { FormHeader } from "./components/FormHeader"

export interface FormLayoutProps {
  isInitialData: boolean
  handleDelete: () => Promise<void>
  handleFormSubmit: (values: FormValuesType) => Promise<void>
  form: UseFormReturn<FormValuesType>
  children: React.ReactNode
  formTitle:
    | "billboard"
    | "category"
    | "color"
    | "product"
    | "size"
    | "settings"
}

export const FormLayout: React.FC<FormLayoutProps> = ({
  isInitialData,
  formTitle,
  handleDelete,
  handleFormSubmit,
  form,
  children,
}) => {
  const { title, description, action } = formStaticData(
    isInitialData,
    formTitle
  )

  return (
    <>
      <FormHeader
        title={title}
        description={description}
        isInitialData={isInitialData}
        handleDelete={handleDelete}
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="space-y-8 w-full"
        >
          {children}
          <LoaderButton text={action} />
        </form>
      </Form>
    </>
  )
}
