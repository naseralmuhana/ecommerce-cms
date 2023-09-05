"use client"

import { useEffect, useState } from "react"
import { ImagePlus, Trash } from "lucide-react"
import Image from "next/image"
import { CldUploadWidget } from "next-cloudinary"

import { Button } from "@/components/ui/button"
import useLoading from "@/hooks/useLoading"

type ImageUploadProps = {
  onChange: (value: string) => void
  onRemove: (value: string) => void
  value: string[]
}

export function ImageUpload({ onChange, onRemove, value }: ImageUploadProps) {
  const loading = useLoading((state) => state.loading)

  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const onUpload = (result: any) => {
    onChange(result.info.secure_url)
  }

  if (!isMounted) return null
  return (
    <div>
      <div className="mb-4 flex items-center gap-4">
        {value.map((url) => (
          <div
            key={url}
            className="relative w-[200px] h-[200px] rounded-md overflow-hidden"
          >
            <div className="z-10 absolute top-2 right-2">
              <Button
                disabled={loading}
                type="button"
                onClick={() => onRemove(url)}
                variant="destructive"
                size="icon"
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
            <Image
              fill
              className="object-cover"
              alt="Image"
              src={url}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ))}
      </div>
      <CldUploadWidget onUpload={onUpload} uploadPreset="auofpjym">
        {({ open }) => {
          const handleOnClick = () => {
            open()
          }
          return (
            <Button
              onClick={handleOnClick}
              disabled={loading}
              variant="secondary"
              type="button"
            >
              <ImagePlus className="h-4 w-4 mr-2" />
              Upload an image
            </Button>
          )
        }}
      </CldUploadWidget>
    </div>
  )
}
