{/* [OKS *0-0*]  toast for alert messages  */}
const Toast = ({ message }) => {
  if (!message) return null;

  return (
    <div className="fixed top-4 right-4 bg-red-600 text-white px-4 py-2 rounded shadow">
      {message}
    </div>
  );
};
export default Toast;
