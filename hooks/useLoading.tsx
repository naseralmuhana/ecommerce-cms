import { create } from "zustand"

type useLoadingParams = {
  loading: boolean
  setLoading: (loading: boolean) => void
}

const useLoading = create<useLoadingParams>((set) => ({
  loading: false,
  setLoading: (loading: boolean) => set(() => ({ loading })),
}))

export default useLoading
