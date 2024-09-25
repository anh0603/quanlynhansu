const SelectComponent = ({ props, children }) => {

  return (
    <>
      <select {...props}>
        {
          children
        };
      </select>
    </>
  )
}

export default SelectComponent;