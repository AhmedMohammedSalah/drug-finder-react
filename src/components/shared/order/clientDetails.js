import React from "react";

// [SARA] : Shared ClientDetails component for admin pages
const ClientDetails = ({ client, fetchClientById }) => {
  const [clientObj, setClientObj] = React.useState(
    typeof client === "object" ? client : null
  );
  const [userName, setUserName] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    let ignore = false;
    if (!clientObj && typeof client === "number") {
      setLoading(true);
      fetchClientById(client).then((data) => {
        if (!ignore) {
          setClientObj(data);
          setLoading(false);
        }
      });
    }
    return () => {
      ignore = true;
    };
  }, [client, clientObj, fetchClientById]);

  React.useEffect(() => {
    let ignore = false;
    async function fetchUserName() {
      if (clientObj && clientObj.user && typeof clientObj.user === "number") {
        try {
          const res = await fetch(
            `https://ahmedmsalah.pythonanywhere.com/users/users/${clientObj.user}/`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("access_token")}`,
              },
            }
          );
          if (!res.ok) return;
          const data = await res.json();
          if (!ignore) setUserName(data.name);
        } catch {}
      } else if (clientObj && clientObj.user && clientObj.user.name) {
        setUserName(clientObj.user.name);
      } else if (clientObj && clientObj.name) {
        setUserName(clientObj.name);
      }
    }
    fetchUserName();
    return () => {
      ignore = true;
    };
  }, [clientObj]);

  if (loading)
    return <span className="text-gray-400 text-xs">Loading client...</span>;
  if (!clientObj)
    return <span className="text-gray-400 text-xs">Unknown client</span>;

  let imageUrl = clientObj.image_profile;
  if (imageUrl && imageUrl.startsWith("/media")) {
    imageUrl = `https://ahmedmsalah.pythonanywhere.com${imageUrl}`;
  }
  if (!imageUrl) {
    imageUrl = "https://via.placeholder.com/80x80/cccccc/ffffff?text=No+Image";
  }

  return (
    <div className="flex items-center gap-3 mt-1">
      <img
        src={imageUrl}
        alt="Profile"
        className="w-10 h-10 rounded-full object-cover border border-gray-300"
      />
      <div className="flex flex-col text-xs">
        <span className="font-semibold text-gray-800">
          User: {userName || "-"}
        </span>
        {/* <span className="text-gray-600">{clientObj.email || '-'}</span> */}
        {clientObj.info_disease && (
          <span className="text-gray-500 italic">
            Disease: {clientObj.info_disease}
          </span>
        )}
      </div>
    </div>
  );
};

export default ClientDetails;
