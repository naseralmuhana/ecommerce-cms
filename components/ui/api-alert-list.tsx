"use client"

import { useParams } from "next/navigation"

import useOrigin from "@/hooks/useOrigin"
import { ApiAlert } from "@/components/ui/api-alert"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"

export interface ApiAlertListProps {
  entityName: ApiAlertListEntityName
  entityIdName: ApiAlertListEntityNameId
}

export const ApiAlertList: React.FC<ApiAlertListProps> = ({
  entityIdName,
  entityName,
}) => {
  const params = useParams()
  const origin = useOrigin()

  const baseUrl = `${origin}/api/${params.storeId}`

  return (
    <>
      <Heading
        title="Api"
        description={`Api calls for ${entityName}`}
        className="!mt-28"
      />
      <Separator />
      <ApiAlert
        title="GET"
        variant="public"
        description={`${baseUrl}/${entityName}`}
      />
      <ApiAlert
        title="GET"
        variant="public"
        description={`${baseUrl}/${entityName}/{${entityIdName}}`}
      />
      <ApiAlert
        title="POST"
        variant="admin"
        description={`${baseUrl}/${entityName}`}
      />
      <ApiAlert
        title="PATCH"
        variant="admin"
        description={`${baseUrl}/${entityName}/{${entityIdName}}`}
      />
      <ApiAlert
        title="DELETE"
        variant="admin"
        description={`${baseUrl}/${entityName}/{${entityIdName}}`}
      />
    </>
  )
}
