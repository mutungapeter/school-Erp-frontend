interface Props{
  center:boolean;
}
const PageLoadingSpinner = () => {
    return (
      <div className="flex insert-0  h-screen items-center justify-center bg-white bg-opacity-50  z-999999  ">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
    </div>
    );
  };
  
  export default PageLoadingSpinner;
  
// const PageLoadingSpinner = () => {
//   return (
//     <div className="fixed inset-0 flex items-center justify-center z-50 bg-white"> {/* Add background color */}
//       <div className="h-12 w-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
//     </div>
//   );
// };
// export default PageLoadingSpinner;
