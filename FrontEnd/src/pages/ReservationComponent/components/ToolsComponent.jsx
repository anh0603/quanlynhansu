import React from "react";
import ModalAdd from "../modals/ModalAdd";
import ModalCommon from "../modals/ModalCommon";
import useClassStore from "../useClassStore";
import ButtonAddComponent from "./ButtonAddComponent";
import SearchComponent from "./SearchComponent";
import ModalDelete from "../modals/ModalDelete";

const ToolsComponent = ({ setSearchTerm }) => {
  const setShowModalAdd = useClassStore((state) => state.setShowModalAdd);
  const setShowModalCommon = useClassStore((state) => state.setShowModalCommon);

  return (
    <div className="d-flex align-items-center justify-content-between">
      <SearchComponent setSearchTerm={setSearchTerm} />
      <ButtonAddComponent />
      <ModalAdd />
      <ModalCommon />
      <ModalDelete />
    </div>
  );
};

export default ToolsComponent;
