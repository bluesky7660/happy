import React, { useEffect, useState } from "react";
import axios from "axios";

const App2 = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const idToken = await auth.currentUser?.getIdToken(); // Firebase 인증 토큰 가져오기
      const url = "https://firestore.googleapis.com/v1/projects/kallaris-ee3c6/databases/(default)/documents/member";

      try {
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${idToken}`, // 인증 토큰 추가
          },
        });
        setData(response.data.documents); // Firestore에서 반환된 데이터
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Firestore Data</h1>
      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default App2;
