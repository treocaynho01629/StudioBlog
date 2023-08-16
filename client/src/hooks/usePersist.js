import { useState, useEffect } from "react";
import { isPersist } from "../features/auth/authSlice";
import { useSelector } from "react-redux";

const usePersist = () => {
    const persist = useSelector(isPersist);
    return persist
}
export default usePersist