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

function pagination(props) {
  let pages = [];
  const totalPages = Math.ceil(props.dataLength / props.dataPerPage);
  for (let i = 1; i <= totalPages; i++) {
    // Create page numbers for pagination
    pages.push(i);
  }
  const handlePrev = () => {
    if (props.currentPage > 1) {
      props.setcurrentPage(props.currentPage - 1); // Decrease the page number
    }
  };
  const handleNext = () => {
    if (props.currentPage < totalPages) {
      props.setcurrentPage(props.currentPage + 1); // Increase the page number
    }
  };
  return (
    <div>
      <button onClick={handlePrev} disabled={props.currentPage === 1}>
        Prev
      </button>
      <p>{props.currentPage}</p>
      <button onClick={handleNext} disabled={props.currentPage === totalPages}>
        Next
      </button>
    </div>
  );
}
export default pagination;
