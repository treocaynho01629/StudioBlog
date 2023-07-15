import { useEffect, useState } from "react";
import axios from "axios";

function useFetch(url) {
  const [data, setData] = useState(null);
  const [isLoading, setIsloading] = useState(true);
  const [isErr, setIsErr] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setIsloading(true);
        const res = await axios.get(url, {
          signal: controller.signal
        });
        isMounted && setData(res.data);
      } catch(err) {
        setIsErr(true);
        console.log(err);
      }
      setIsloading(false);
    };
    fetchData();

    return () => {
      isMounted = false;
      controller.abort();
    }
  }, [url]);

  const refetch = () => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        setIsloading(true);
        const res = await axios.get(url, {
          signal: controller.signal
        });
        isMounted && setData(res.data);
      } catch(err) {
        setIsErr(true);
        console.log(err);
      }
      setIsloading(false);
    };
    fetchData();

    return () => {
      isMounted = false;
      controller.abort();
    }
  };

  return { data, isLoading, isErr, refetch };
}

export default useFetch;