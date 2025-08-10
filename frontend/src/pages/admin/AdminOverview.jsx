import { useEffect, useState } from "react";

const AdminOverview = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("userToken"); // Assuming token is stored with this key
    if (!token) {
      // Handle case where user is not logged in
      console.error("Admin token not found.");
      return;
    }

    fetch("http://localhost:5000/api/admin/predictions", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch predictions");
        }
        return res.json();
      })
      .then((data) => {
        setData(data); // The API now returns the array directly
      })
      .catch((error) => {
        console.error("Error fetching predictions:", error);
        // Optionally, set an error state to display to the user
      });
  }, []);
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📋 All Users Predictions</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border text-md">
          <thead className="bg-gray-200">
            <tr>
              <td className="p-2 border">Users</td>
              <td className="p-2 border">Result</td>
              <td className="p-2 border">Confidence</td>
              <td className="p-2 border">Date</td>
            </tr>
          </thead>
          <tbody>
            {data.map((record, index) => (
              <tr key={record.id || index} className="hover:bg-gray-50">
                <td className="border p-2">{record.email}</td>
                <td className="border p-2">{record.result}</td>
                <td className="border p-2">
                  {record.confidence && !isNaN(parseFloat(record.confidence))
                    ? `${(parseFloat(record.confidence) * 100).toFixed(2)}%`
                    : "N/A"}
                </td>
                <td className="border p-2">
                  {new Date(record.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOverview;
