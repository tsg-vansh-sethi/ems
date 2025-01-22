import { useState } from "react";
function AdminDashboard() {
  const [search, setSearch] = useState("");
  const handleSearch = (e) => {
    setSearch(e.target.value);
    console.log(e.target.value);
  };

  const data = [
    {
      id: 1,
      name: "Vansh Kumar",
      email: "vansh.kumar@example.com",
      phonenumber: "+1-555-234-5678",
      address: "123 Maple Street, New York, NY",
      department: "Finance",
      role: "Analyst",
      Joindate: "2022-05-15",
    },
    {
      id: 2,
      name: "Sophia Patel",
      email: "sophia.patel@example.com",
      phonenumber: "+1-555-678-1234",
      address: "456 Elm Avenue, Chicago, IL",
      department: "Marketing",
      role: "Manager",
      Joindate: "2021-03-20",
    },
    {
      id: 3,
      name: "Liam Smith",
      email: "liam.smith@example.com",
      phonenumber: "+1-555-345-6789",
      address: "789 Pine Road, Los Angeles, CA",
      department: "Engineering",
      role: "Software Developer",
      Joindate: "2020-08-10",
    },
    {
      id: 4,
      name: "Emma Johnson",
      email: "emma.johnson@example.com",
      phonenumber: "+1-555-987-6543",
      address: "101 Birch Lane, Houston, TX",
      department: "Human Resources",
      role: "HR Specialist",
      Joindate: "2019-11-25",
    },
    {
      id: 5,
      name: "Noah Brown",
      email: "noah.brown@example.com",
      phonenumber: "+1-555-123-4567",
      address: "202 Oak Drive, Miami, FL",
      department: "Sales",
      role: "Sales Executive",
      Joindate: "2023-01-05",
    },
    {
      id: 6,
      name: "Olivia Davis",
      email: "olivia.davis@example.com",
      phonenumber: "+1-555-654-3210",
      address: "303 Cedar Court, Seattle, WA",
      department: "Operations",
      role: "Operations Manager",
      Joindate: "2018-07-12",
    },
    {
      id: 7,
      name: "Elijah Miller",
      email: "elijah.miller@example.com",
      phonenumber: "+1-555-432-5678",
      address: "404 Ash Street, Denver, CO",
      department: "IT",
      role: "System Administrator",
      Joindate: "2020-09-30",
    },
    {
      id: 8,
      name: "Ava Wilson",
      email: "ava.wilson@example.com",
      phonenumber: "+1-555-876-5432",
      address: "505 Spruce Avenue, Atlanta, GA",
      department: "Design",
      role: "Graphic Designer",
      Joindate: "2021-02-18",
    },
    {
      id: 9,
      name: "Mason Taylor",
      email: "mason.taylor@example.com",
      phonenumber: "+1-555-234-8765",
      address: "606 Willow Street, Boston, MA",
      department: "Legal",
      role: "Legal Advisor",
      Joindate: "2017-06-22",
    },
    {
      id: 10,
      name: "Isabella Martinez",
      email: "isabella.martinez@example.com",
      phonenumber: "+1-555-789-1234",
      address: "707 Poplar Road, San Francisco, CA",
      department: "Customer Support",
      role: "Customer Support Specialist",
      Joindate: "2022-10-03",
    },
  ];

  const filterData = () => {
    return (
      data.length > 0 &&
      data
        .filter((item) => {
          return search.toLowerCase() === ""
            ? item
            : item.name.toLowerCase().includes(search.toLowerCase());
        })
        .map((item) => (
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.name}</td>
            <td>{item.email}</td>
            <td>{item.phonenumber}</td>
            <td>{item.address}</td>
            <td>{item.department}</td>
            <td>{item.role}</td>
            <td>{item.Joindate}</td>
            <td>
              <button>Edit</button>/<button>Delete</button>
            </td>
          </tr>
        ))
    );
  };
  return (
    <div>
      <div className="navBar">
        <h2>Hi User!</h2>
        <div className="NavItems">
          <ul>
            <li style={{ listStyle: "none" }}>
              <button>Add Employee</button>
            </li>
            <li style={{ listStyle: "none" }}>
              <button>Signout</button>
            </li>
          </ul>
        </div>
      </div>
      <div className="searchBar">
        <input
          type="text"
          name="userInput"
          placeholder="Search For Employee"
          onChange={handleSearch}
        ></input>
      </div>
      <table style={{ border: "1px solid black" }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Address</th>
            <th>Department</th>
            <th>Role</th>
            <th>Join Date</th>
          </tr>
        </thead>
        <tbody>{filterData()}</tbody>
      </table>
    </div>
  );
}

export default AdminDashboard;
