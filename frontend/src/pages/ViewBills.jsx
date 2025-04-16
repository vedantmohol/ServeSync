import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Table } from "flowbite-react";

export default function ViewBills() {
  const { currentUser } = useSelector((state) => state.user);
  const [summary, setSummary] = useState({ totalAmount: 0, gstAmount: 0, revenue: 0 });
  const [billsByMonth, setBillsByMonth] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBills = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/hotel/getBills?phone=${currentUser?.phone}`);
        const data = await res.json();
        if (res.ok) {
          setSummary({
            totalAmount: data.totalAmount,
            gstAmount: data.gstAmount,
            revenue: data.revenue,
          });
          setBillsByMonth(data.bills);
        } else {
          setError(data.message || "Failed to fetch bills.");
        }
      } catch (err) {
        console.error("Error fetching hotel bills:", err);
        setError("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?.role === "hotel_admin" && currentUser.phone) {
      fetchBills();
    }
  }, [currentUser]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-700">Hotel Bills Summary</h1>

      {loading && <p className="text-center text-blue-600 mb-4">Loading...</p>}
      {error && <p className="text-center text-red-500 mb-4">{error}</p>}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-green-100 p-4 rounded-md shadow text-center">
              <h2 className="text-lg font-semibold text-gray-700">Total Subtotal</h2>
              <p className="text-2xl font-bold text-green-700">₹{summary.totalAmount}</p>
            </div>
            <div className="bg-yellow-100 p-4 rounded-md shadow text-center">
              <h2 className="text-lg font-semibold text-gray-700">Total GST</h2>
              <p className="text-2xl font-bold text-yellow-700">₹{summary.gstAmount}</p>
            </div>
            <div className="bg-blue-100 p-4 rounded-md shadow text-center">
              <h2 className="text-lg font-semibold text-gray-700">Total Revenue</h2>
              <p className="text-2xl font-bold text-blue-700">₹{summary.revenue}</p>
            </div>
          </div>

          {Object.keys(billsByMonth).map((monthKey) => (
            <div key={monthKey} className="mb-10">
              <h2 className="text-2xl font-bold text-purple-600 mb-4">{monthKey}</h2>
              <Table hoverable>
                <Table.Head>
                  <Table.HeadCell>Bill No</Table.HeadCell>
                  <Table.HeadCell>Date</Table.HeadCell>
                  <Table.HeadCell>Subtotal</Table.HeadCell>
                  <Table.HeadCell>GST</Table.HeadCell>
                  <Table.HeadCell>SGST</Table.HeadCell>
                  <Table.HeadCell>Grand Total</Table.HeadCell>
                  <Table.HeadCell>Payment Mode</Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {billsByMonth[monthKey].map((bill, idx) => (
                    <Table.Row key={idx} className="bg-white dark:bg-gray-800">
                      <Table.Cell>{bill.billNo}</Table.Cell>
                      <Table.Cell>{formatDate(bill.createdAt)}</Table.Cell>
                      <Table.Cell>₹{bill.subTotal}</Table.Cell>
                      <Table.Cell>{bill.gst}%</Table.Cell>
                      <Table.Cell>{bill.sgst}%</Table.Cell>
                      <Table.Cell>₹{bill.grandTotal}</Table.Cell>
                      <Table.Cell>{bill.paymentMode}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
