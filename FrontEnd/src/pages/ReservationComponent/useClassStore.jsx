import { create } from "zustand";
import { reservationApi } from "../../services/reservationApi";
const useClassStore = create((set, get) => ({
  showModalAdd: false,
  setShowModalAdd: (value) => set({ showModalAdd: value }),

  mode: false,
  setMode: (value) => set({ mode: value }),

  showModalCommon: false,
  setShowModalCommon: (value) => set({ showModalCommon: value }),

  showModalDelete: false,
  setShowModalDelete: (value) => set({ showModalDelete: value }),

  itemToDelete: null,
  setItemToDelete: (id) => set({ itemToDelete: id }),

  handleClose: () =>
    set({
      showModalAdd: false,
      showModalCommon: false,
      showModalDelete: false,
      itemToDelete: null,
    }),

  handleDelete: async () => {
    const { itemToDelete } = get(); // Correct way to access state in Zustand
    if (itemToDelete) {
      try {
        await reservationApi.deleteReservation(itemToDelete);
        console.log(`Deleted item with ID: ${itemToDelete}`);
        // Optionally, refetch the data or update the state here
      } catch (error) {
        console.error("Error deleting item:", error);
      }
      set({ showModalDelete: false });
    }
  },
}));

export default useClassStore;
