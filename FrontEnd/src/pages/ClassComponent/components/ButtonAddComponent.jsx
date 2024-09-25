import { Button } from "react-bootstrap";
import { Plus } from "react-bootstrap-icons";
import useClassStore from "../useClassStore";

const ButtonAddComponent = () => {
  const setShowModalCommon = useClassStore((state) => state.setShowModalCommon);
  const setModeModal = useClassStore((state) => state.setModeModal);

  return (
    <Button
      variant="primary"
      onClick={() => {
        setShowModalCommon(true);
        setModeModal(false);
      }}
      className="float-right mb-3 d-flex align-items-center"
    >
      Thêm mới
      <div className="ml-1">
        <Plus size={22} />
      </div>
    </Button>
  );
};

export default ButtonAddComponent;
