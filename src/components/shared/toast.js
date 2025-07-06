{/* [OKS *0-0*]  toast for alert messages  */}
const Toast = ({ message }) => {
  if (!message) return null;
  let display = '';
  if (typeof message === 'string') {
    display = message;
  } else if (typeof message === 'object') {
    // Try to extract a user-friendly message
    if (message.detail) display = message.detail;
    else if (message.message) display = message.message;
    else if (message.messages) display = Array.isArray(message.messages) ? message.messages.join(', ') : JSON.stringify(message.messages);
    else display = JSON.stringify(message);
  } else {
    display = String(message);
  }
  return (
    <div className="fixed bottom-3 right-4 bg-red-600 text-white px-4 py-2 rounded shadow">
      {display}
    </div>
  );
};
export default Toast;
