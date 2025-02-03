// function pagination(props) {
//   let pages = [];
//   for (let i = 1; i <= Math.ceil(props.dataLength / props.dataPerPage); i++) {
// Create page numbers for pagination
//     pages.push(i);
//   }
//   console.log(pages);
//   return (
//     <>
//       {pages.length > 0 &&
//         pages.map((item) => (
//           <button onClick={() => props.setcurrentPage(item)}>{item}</button>
//         ))}
//     </>
//   );
// }
// export default pagination;
import { useContext } from "react";
import { AuthContext } from "./AuthProvider.jsx";
function pagination(props) {
  const { dataPerPage, currentPage, setcurrentPage } = useContext(AuthContext);
  let pages = [];
  const totalPages = Math.ceil(props.filteredDataLength / dataPerPage);
  for (let i = 1; i <= totalPages; i++) {
    // Create page numbers for pagination
    pages.push(i);
  }
  const handlePrev = () => {
    if (currentPage > 1) {
      setcurrentPage(currentPage - 1); // Decrease the page number
    }
  };
  const handleNext = () => {
    if (currentPage < totalPages) {
      setcurrentPage(currentPage + 1); // Increase the page number
    }
  };
  return (
    <div className="flex justify-between items-center mt-4">
      <button onClick={handlePrev} disabled={currentPage === 1}>
        Prev
      </button>
      <p>{currentPage}</p>
      <button onClick={handleNext} disabled={currentPage === totalPages}>
        Next
      </button>
    </div>
  );
}
export default pagination;
