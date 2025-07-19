import { useEffect, useState } from "react";

const AdminOverview = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/admin/predictions")
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setData(json.data);
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
              <tr key={index} className="hover:bg-gray-50">
                <td className="border p-2">{record.users}</td>
                <td className="border p-2">{record.result}</td>
                <td className="border p-2">{record.confidence}</td>
                <td className="border p-2">
                  {record.timestamp?.split("T")[0]}
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
