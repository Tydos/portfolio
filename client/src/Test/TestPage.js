import React, { useEffect, useState } from "react";

function TestPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("https://portfolio-backend-server-phi.vercel.app/api/projects")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
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
