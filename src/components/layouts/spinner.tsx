const Spinner=()=>{
    return (
        <>
        {/* <div className="border-gray-300 h-20 w-20 animate-spin rounded-full border-8 border-t-blue-600" /> */}
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
      <div className="border-gray-300 h-20 w-20 animate-spin rounded-full border-8 border-t-blue-600" />
    </div>
        </>
    )
}
export default Spinner