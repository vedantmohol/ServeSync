import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export default function CustomerPrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);

  return currentUser && currentUser.role === 'customer' ? (
    <Outlet />
  ) : (
    <Navigate to="/sign-in" />
  );
}
