"use client"

import Link from "next/link"
import { useParams, usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

type MainNavProps = React.HTMLAttributes<HTMLElement>

export default function MainNav({ className }: MainNavProps) {
  const pathname = usePathname()
  const params = useParams()

  // Define the navigation routes
  const routes = [
    {
      label: "Overview",
      href: `/${params.storeId}`,
    },
    {
      label: "Billboards",
      href: `/${params.storeId}/billboards`,
    },
    {
      label: "Categories",
      href: `/${params.storeId}/categories`,
    },
    {
      label: "Sizes",
      href: `/${params.storeId}/sizes`,
    },
    {
      label: "Colors",
      href: `/${params.storeId}/colors`,
    },
    {
      label: "Products",
      href: `/${params.storeId}/products`,
    },
    {
      label: "Orders",
      href: `/${params.storeId}/orders`,
    },
    {
      label: "Settings",
      href: `/${params.storeId}/settings`,
    },
  ]
  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)}>
      {routes.map(({ label, href }) => {
        // Determine if the current route is active
        const active = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              active ? "text-black dark:text-white" : "text-muted-foreground"
            )}
          >
            {label}
          </Link>
        )
      })}
    </nav>
  )
}
