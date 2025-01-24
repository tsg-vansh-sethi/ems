import { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import SignUp from "../pages/SignUp.jsx";

function addEmployeeForm() {
  const [visible, setVisible] = useState(false);
  const handleClick = () => {
    setVisible(true);
  };
  const closeForm = () => {
    setVisible(false);
  };
  return (
    <>
      <button onClick={handleClick}>Add Employee</button>
      {visible && (
        <div className="fixed inset-0 bg-black-opacity-30 backdrop-blur-sm flex items-center justify-center">
          <SignUp />
          <RxCross1 onClick={closeForm} />
        </div>
      )}
    </>
  );
}

export default addEmployeeForm;
