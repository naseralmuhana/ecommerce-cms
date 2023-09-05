import { create } from "zustand"

// Define the type for the parameters of the custom hook.
type UseStoreModalParams = {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

const useStoreModal = create<UseStoreModalParams>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }), // A function that sets the isOpen state to true.
  onClose: () => set({ isOpen: false }), // A function that sets the isOpen state to false.
}))

export default useStoreModal
