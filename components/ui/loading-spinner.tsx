export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center w-full h-full min-h-[50vh]">
      <div className="w-12 h-12 border-4 border-t-purple-500 border-r-green-400 border-b-green-400 border-l-purple-500 rounded-full animate-spin"></div>
    </div>
  )
}
