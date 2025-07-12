import React from "react";

// [SARA] : Shared StoreDetails component for admin pages
const StoreDetails = ({ store }) => {
  const [storeObj, setStoreObj] = React.useState(
    typeof store === "object" ? store : null
  );
  const [loading, setLoading] = React.useState(false);

  // Uncomment and implement fetch if you want to fetch store by ID
  // React.useEffect(() => {
  //   let ignore = false;
  //   async function fetchStore() {
  //     if (!storeObj && typeof store === 'number') {
  //       setLoading(true);
  //       try {
  //         const res = await fetch(`https://ahmedmsalah.pythonanywhere.com/medical_stores/${store}/`, {
  //           headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token')}` }
  //         });
  //         if (!res.ok) return;
  //         const data = await res.json();
  //         if (!ignore) setStoreObj(data);
  //       } catch {}
  //       setLoading(false);
  //     }
  //   }
  //   fetchStore();
  //   return () => { ignore = true; };
  // }, [store, storeObj]);

  if (loading)
    return <span className="text-gray-400 text-xs">Loading store...</span>;
  // if (!storeObj) return <span className="text-gray-400 text-xs">Unknown store</span>;

  return (
    <div className="flex flex-col text-xs">
      {/* <span className="text-gray-500">ID: {store.id || 'id issue'}</span> */}
      <span className="font-semibold text-gray-800">
        Name: {store.store_name || "Unnamed Store"}
      </span>
      <span className="text-gray-600">
        Address: {store.store_address || "No address"}
      </span>
    </div>
  );
};

export default StoreDetails;
