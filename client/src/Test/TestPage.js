import React, { useEffect, useState } from "react";
import { fetchProjects } from "../api/api";

function TestPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchProjects()
      .then((data) => {
        setData(data);
        console.log("Fetched data:", data);
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  return (
    <>
      <p>hello mic test one two three....</p>
      {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : "Loading..."}
    </>
  );
}

export default TestPage;
