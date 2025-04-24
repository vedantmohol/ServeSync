import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Alert, Button, Modal, Table } from "flowbite-react";

export default function AdminHomePage() {
  const { currentUser } = useSelector((state) => state.user);
  const [staffData, setStaffData] = useState(null);
  const [error, setError] = useState("");
  const [staffToDelete, setStaffToDelete] = useState(null); 
  const [successMsg, setSuccessMsg] = useState("");

  const roleKeyMap = {
    chef: "chefs",
    waiter: "waiters",
    hall_manager: "hallManagers",
  };

  const numberKeyMap = {
    chef: "numberOfChefs",
    waiter: "numberOfWaiters",
    hall_manager: "numberOfHallManagers",
  };

  const titleToRole = {
    "Hall Managers": "hall_manager",
    Chefs: "chef",
    Waiters: "waiter",
  };

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const res = await fetch(`/api/hotel/getStaff?hotelId=${currentUser.hotelId}`);
        const data = await res.json();
        if (res.ok) {
          setStaffData(data);
        } else {
          setError(data.message || "Failed to fetch staff data");
        }
      } catch (err) {
        console.error("Error fetching staff data:", err);
        setError("Something went wrong");
      }
    };

    if (currentUser?.hotelId) fetchStaff();
  }, [currentUser]);

  const handleRemoveStaff = async (phone, role) => {
    try {
      const res = await fetch(`/api/hotel/removeStaff`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone,
          role,
          hotelId: currentUser.hotelId,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccessMsg(`${role.replace("_", " ")} removed successfully`);
        setTimeout(() => setSuccessMsg(""), 3000);

        const updatedList = staffData[roleKeyMap[role]].filter((s) => s.phone !== phone);

        setStaffData((prev) => ({
          ...prev,
          [roleKeyMap[role]]: updatedList,
          [numberKeyMap[role]]: updatedList.length,
        }));
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error("Failed to remove staff:", err);
    } finally {
      setStaffToDelete(null);
    }
  };

  const renderTable = (title, rows) => (
    <div className="mb-10">
      <h2 className="text-xl font-bold mb-3">{title}</h2>
      <Table hoverable>
        <Table.Head>
          <Table.HeadCell>Name</Table.HeadCell>
          <Table.HeadCell>Email</Table.HeadCell>
          <Table.HeadCell>Phone</Table.HeadCell>
          <Table.HeadCell>Staff ID</Table.HeadCell>
          <Table.HeadCell>Joined At</Table.HeadCell>
          <Table.HeadCell>Edit</Table.HeadCell>
          <Table.HeadCell>Remove</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {rows.map((staff, idx) => (
            <Table.Row key={idx} className="bg-white dark:bg-gray-800">
              <Table.Cell>{staff.name}</Table.Cell>
              <Table.Cell>{staff.email}</Table.Cell>
              <Table.Cell>{staff.phone}</Table.Cell>
              <Table.Cell>{staff.staffID}</Table.Cell>
              <Table.Cell>{new Date(staff.createdAt).toLocaleDateString()}</Table.Cell>
              <Table.Cell>
                <span className="text-blue-600 hover:underline cursor-pointer">
                  Edit
                </span>
              </Table.Cell>
              <Table.Cell>
                <span
                  className="text-red-500 hover:underline cursor-pointer"
                  onClick={() =>
                    setStaffToDelete({
                      phone: staff.phone,
                      role: titleToRole[title],
                    })
                  }
                >
                  Remove
                </span>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );

  return (
    <>
      <div className="p-4 max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-700 mb-6">
          Admin Dashboard
        </h1>

        {successMsg && (
          <Alert color="success" className="mb-4 text-center">
            {successMsg}
          </Alert>
        )}

        {error && <p className="text-center text-red-500 mb-4">{error}</p>}

        {staffData && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-purple-100 p-4 rounded shadow text-center">
                <h2 className="text-lg font-semibold">Hall Managers</h2>
                <p className="text-2xl font-bold text-purple-800">
                  {staffData.numberOfHallManagers}
                </p>
              </div>
              <div className="bg-red-100 p-4 rounded shadow text-center">
                <h2 className="text-lg font-semibold">Chefs</h2>
                <p className="text-2xl font-bold text-red-800">
                  {staffData.numberOfChefs}
                </p>
              </div>
              <div className="bg-yellow-100 p-4 rounded shadow text-center">
                <h2 className="text-lg font-semibold">Waiters</h2>
                <p className="text-2xl font-bold text-yellow-800">
                  {staffData.numberOfWaiters}
                </p>
              </div>
            </div>

            {renderTable("Hall Managers", staffData.hallManagers)}
            {renderTable("Chefs", staffData.chefs)}
            {renderTable("Waiters", staffData.waiters)}
          </>
        )}
      </div>

      <Modal
        show={!!staffToDelete}
        onClose={() => setStaffToDelete(null)}
        size="md"
        popup
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <h3 className="mb-5 text-lg text-gray-600">
              Are you sure you want to remove this staff member?
            </h3>
            <div className="flex justify-center gap-4">
              <Button
                color="failure"
                onClick={() =>
                  handleRemoveStaff(staffToDelete.phone, staffToDelete.role)
                }
              >
                Yes, Remove
              </Button>
              <Button color="gray" onClick={() => setStaffToDelete(null)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
