import { useState } from "react";
import Pagination from "../components/pagination.jsx";
import AddEmployeeForm from "../components/addEmployeeForm.jsx";
import { Link } from "react-router-dom";
function AdminDashboard() {
  const [search, setSearch] = useState("");
  // pagination
  const [currentPage, setcurrentPage] = useState(1);
  const [dataPerPage, setdataPerPage] = useState(5);
  // in js we have slice functions cuts array using start and last index
  // data.slice(10,20) we will get data of values raning from 11 to 20
  // now how to find last and post index
  const lastIndex = currentPage * dataPerPage;
  const firstIndex = lastIndex - dataPerPage;

  const handleSearch = (e) => {
    setSearch(e.target.value);
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
    {
      id: 11,
      name: "Vansh Williams",
      email: "ethan.williams@example.com",
      phonenumber: "+1-555-111-2222",
      address: "111 Cherry Lane, Dallas, TX",
      department: "Finance",
      role: "Accountant",
      Joindate: "2023-02-12",
    },
    {
      id: 12,
      name: "Ava Johnson",
      email: "ava.johnson@example.com",
      phonenumber: "+1-555-333-4444",
      address: "222 Maple Avenue, Phoenix, AZ",
      department: "Marketing",
      role: "SEO Specialist",
      Joindate: "2021-06-25",
    },
    {
      id: 13,
      name: "James Brown",
      email: "james.brown@example.com",
      phonenumber: "+1-555-555-6666",
      address: "333 Pine Drive, San Diego, CA",
      department: "Engineering",
      role: "Backend Developer",
      Joindate: "2020-04-30",
    },
    {
      id: 14,
      name: "Mia Davis",
      email: "mia.davis@example.com",
      phonenumber: "+1-555-777-8888",
      address: "444 Oak Street, Las Vegas, NV",
      department: "Human Resources",
      role: "HR Manager",
      Joindate: "2019-01-14",
    },
    {
      id: 15,
      name: "Lucas Martinez",
      email: "lucas.martinez@example.com",
      phonenumber: "+1-555-999-0000",
      address: "555 Birch Court, Orlando, FL",
      department: "Sales",
      role: "Sales Representative",
      Joindate: "2022-11-20",
    },
    {
      id: 16,
      name: "Ella Hernandez",
      email: "ella.hernandez@example.com",
      phonenumber: "+1-555-121-2323",
      address: "666 Cedar Lane, Portland, OR",
      department: "Operations",
      role: "Logistics Coordinator",
      Joindate: "2021-08-05",
    },
    {
      id: 17,
      name: "Benjamin Thompson",
      email: "benjamin.thompson@example.com",
      phonenumber: "+1-555-343-4545",
      address: "777 Willow Way, Charlotte, NC",
      department: "IT",
      role: "Network Engineer",
      Joindate: "2020-10-11",
    },
    {
      id: 18,
      name: "Amelia Taylor",
      email: "amelia.taylor@example.com",
      phonenumber: "+1-555-565-6767",
      address: "888 Poplar Street, Nashville, TN",
      department: "Design",
      role: "UI/UX Designer",
      Joindate: "2021-03-18",
    },
    {
      id: 19,
      name: "Henry White",
      email: "henry.white@example.com",
      phonenumber: "+1-555-787-8989",
      address: "999 Ash Avenue, Austin, TX",
      department: "Legal",
      role: "Legal Consultant",
      Joindate: "2018-12-04",
    },
    {
      id: 20,
      name: "Charlotte Moore",
      email: "charlotte.moore@example.com",
      phonenumber: "+1-555-909-1010",
      address: "1010 Spruce Boulevard, Detroit, MI",
      department: "Customer Support",
      role: "Customer Success Manager",
      Joindate: "2022-07-22",
    },
    {
      id: 21,
      name: "Jack Robinson",
      email: "jack.robinson@example.com",
      phonenumber: "+1-555-112-1313",
      address: "1111 Oakwood Street, Denver, CO",
      department: "Finance",
      role: "Financial Analyst",
      Joindate: "2021-09-10",
    },
    {
      id: 22,
      name: "Sophia Green",
      email: "sophia.green@example.com",
      phonenumber: "+1-555-414-5151",
      address: "1212 Redwood Road, Seattle, WA",
      department: "Engineering",
      role: "Frontend Developer",
      Joindate: "2020-02-24",
    },
    {
      id: 23,
      name: "Logan Adams",
      email: "logan.adams@example.com",
      phonenumber: "+1-555-616-7171",
      address: "1313 Beech Street, Chicago, IL",
      department: "Marketing",
      role: "Content Strategist",
      Joindate: "2022-05-16",
    },
    {
      id: 24,
      name: "Grace Clark",
      email: "grace.clark@example.com",
      phonenumber: "+1-555-818-9191",
      address: "1414 Aspen Lane, Boston, MA",
      department: "Human Resources",
      role: "Recruiter",
      Joindate: "2019-07-19",
    },
  ];
  const filteredData = data.filter((item) =>
    search.toLowerCase() === ""
      ? true
      : item.name.toLowerCase().includes(search.toLowerCase())
  );
  const currentData = filteredData.slice(firstIndex, lastIndex);
  const renderTableRows = () => {
    return currentData.map((item) => (
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
    ));
  };
  return (
    <div>
      <div className="navBar">
        <h2>Hi User!</h2>
        <div className="NavItems">
          <ul>
            <li style={{ listStyle: "none" }}>
              <AddEmployeeForm />
            </li>
            <li style={{ listStyle: "none" }}>
              <button>
                <Link to="/login">Signout</Link>t
              </button>
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
        <tbody>{renderTableRows()}</tbody>
      </table>
      <Pagination
        dataLength={filteredData.length}
        dataPerPage={dataPerPage}
        currentPage={currentPage}
        setcurrentPage={setcurrentPage}
      />
    </div>
  );
}

export default AdminDashboard;
