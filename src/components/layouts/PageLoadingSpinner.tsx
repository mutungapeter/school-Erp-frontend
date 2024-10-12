const PageLoadingSpinner = () => {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 ">
        <div className="h-12 w-12 border-4 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
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
