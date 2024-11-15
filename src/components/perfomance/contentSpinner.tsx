interface Props{
    center:boolean;
  }
  const ContentSpinner = () => {
      return (
        <div className="flex insert-0  min-h-[10vh] items-center justify-center bg-white bg-opacity-50  z-999999  ">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>
      );
    };
    
    export default ContentSpinner;