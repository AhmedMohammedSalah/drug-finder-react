function SmallBtn(props){

return(

 <>
  <button
    type="button"
    onClick={props.onClick}
    className={`px-6 py-2 rounded text-white text-lg font-semibold ${
      props.btnColor === 'primary' ? 'bg-blue-600 hover:bg-blue-700' :
      props.btnColor === 'secondary' ? 'bg-gray-600 hover:bg-gray-700' :
      props.btnColor === 'danger' ? 'bg-red-600 hover:bg-red-700' :
      'bg-gray-400'
    }`}
  >
    {props.name}
  </button>
</>





)

}

export default SmallBtn