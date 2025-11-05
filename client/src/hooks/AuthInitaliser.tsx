import { useEffect } from "react";
import { useValidateUserQuery } from "../api/authApi";
import { useDispatch, useSelector } from "react-redux";
import { setUser, logout, setLoading } from "../slice/authSlice";
import type { RootState } from "../store/store";

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
    const dispatch = useDispatch();
    const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);

    const { data, error, isLoading } = useValidateUserQuery(undefined, {
        skip: !isAuthenticated,
    });

    useEffect(() => {
        if (isLoading) {
            dispatch(setLoading(true));
        } else if (data) {
            dispatch(setUser(data.user));
        } else if (error) {
            dispatch(logout());
        } else {
            dispatch(setLoading(false));
        }
    }, [data, error, isLoading, dispatch]);

    if (loading) return <p>Loading...</p>;

    return <>{children} </>;
}
