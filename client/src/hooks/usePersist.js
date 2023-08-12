import { useState, useEffect } from "react";
import { isPersist } from "../features/auth/authSlice";
import { useSelector } from "react-redux";

const usePersist = () => {
    // const [persist, setPersist] = useState(JSON.parse(localStorage.getItem("persist")) || false);

    // useEffect(() => {
    //     console.log('peeeersona');
    //     localStorage.setItem("persist", JSON.stringify(persist));
    // }, [persist]);

    // return [ persist, setPersist ]
    const persist = useSelector(isPersist);

    return persist
}
export default usePersist