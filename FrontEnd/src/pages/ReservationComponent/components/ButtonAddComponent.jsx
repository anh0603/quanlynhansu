import React from "react";
import { Button } from "react-bootstrap";
import { Plus } from "react-bootstrap-icons";
import useClassStore from "../useClassStore";

const ButtonAddComponent = () => {
  const setShowModalAdd = useClassStore((state) => state.setShowModalAdd);
  const setMode = useClassStore((state) => state.setMode);

  return (
    <Button
      variant="primary"
      onClick={() => {
        setShowModalAdd(true);
        setMode(false);
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
