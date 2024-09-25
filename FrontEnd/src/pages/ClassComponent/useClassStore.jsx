import { create } from "zustand";

const useClassStore = create((set) => ({
  modeModal: false,
  setModeModal: (value) => set({ modeModal: value }),
  showModalView: false,
  setShowModalView: (value) => set({ showModalView: value }),
  showModalCommon: false,
  setShowModalCommon: (value) => set({ showModalCommon: value }),
  handleClose: () => set({ showModalView: false, showModalCommon: false }),
  dataRow: {},
  setDataRow: (value) => set({ dataRow: value }),
}));

export default useClassStore;
