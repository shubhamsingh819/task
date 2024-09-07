import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filterZipCode, setFilterZipCode] = useState("All");
  const [zipcodes, setZipcodes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/users"
      );
      setUsers(response?.data);
      setFilteredUsers(response.data);
      const uniquieZipcondes = [
        ...new Set(response.data.map((user) => user.address.zipcode)),
      ];
      setZipcodes(["All", ...uniquieZipcondes]);
    } catch (error) {
      console.log("Error while fetching ", error);
    }
    setLoading(false);
  };

  const handleRefresh = () => {
    fetchUserData();
  };

  const handleSearchChange = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    if (value === "") {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(
        users.filter((user) => user.name.toLowerCase().includes(value))
      );
    }
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilterZipCode(value);
    if (value === "All") {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(users.filter((user) => user.address.zipcode === value));
    }
  };

  console.log(zipcodes, "zipcodes");

  const handleSort = (column) => {
    let sortedUsers = [...filteredUsers];
    if (sortOrder === "asc") {
      sortedUsers.sort((a, b) => (a[column] > b[column] ? 1 : -1));
      setSortOrder("desc");
    } else if (sortOrder === "desc") {
      sortedUsers.sort((a, b) => (a[column] < b[column] ? 1 : -1));
      setSortOrder(null);
    } else {
      setSortOrder("asc");
    }
    setFilteredUsers(sortedUsers);
  };

  return (
    <div className="App">
      <h1>Users List Application</h1>
      {loading && <h1>loading...</h1>}
      <div className="heading">
        <div>
          <label>Filter by Zipcode:</label>
          <select value={filterZipCode} onChange={handleFilterChange}>
            {zipcodes.map((zipcode) => (
              <option key={zipcode} value={zipcode}>
                {zipcode}
              </option>
            ))}
          </select>
        </div>

        <div className="right">
          <div>
            <input
              type="text"
              placeholder="Search by name"
              value={searchTerm}
              className="searchBox"
              onChange={handleSearchChange}
            />
          </div>
          <div>
            <button onClick={handleRefresh}>Refresh</button>
          </div>
        </div>
      </div>

      <table border="1">
        <thead>
          <tr>
            <th onClick={() => handleSort("name")}> Name {sortOrder}</th>
            <th>Username</th>
            <th>Email</th>
            <th onClick={() => handleSort("address.zipcode")}>
              {" "}
              Zipcode {sortOrder}
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.address.zipcode}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
