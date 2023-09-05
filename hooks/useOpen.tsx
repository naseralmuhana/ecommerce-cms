import { create } from "zustand"

type useOpenParams = {
  open: boolean
  setOpen: (open: boolean) => void
}

const useOpen = create<useOpenParams>((set) => ({
  open: false,
  setOpen: (open: boolean) => set(() => ({ open })),
}))

export default useOpen
