// import { useEffect, useState } from 'react';

// function useApi(url: unknown, options = {}) {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch(url, options);
        
//         if (!response.ok) {
//           throw new Error(response.statusText);
//         }

//         const result = await response.json();
//         setData(result);
//       } catch (err) {
//         setError(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [url]);

//   return { data, loading, error };
// }

// export default useApi;