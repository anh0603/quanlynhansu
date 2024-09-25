import ModalAdd from "../modals/ModalAdd";
import ModalCommon from "../modals/ModalCommon";
import ModalView from "../modals/ModalView";
import ButtonAddComponent from "./ButtonAddComponent";
import SearchComponent from "./SearchComponent";

const ToolsComponent = () => {
  return (
    <div className="d-flex align-items-center justify-content-between">
      <SearchComponent />
      <ButtonAddComponent />
      {/* <ModalAdd /> */}
      <ModalCommon />
      <ModalView />
    </div>
  );
};

export default ToolsComponent;
