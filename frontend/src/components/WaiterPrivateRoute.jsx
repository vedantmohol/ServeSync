import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export default function WaiterPrivateRoute(){
  const { currentUser } = useSelector((state) => state.user);

  return currentUser && currentUser.role === 'waiter' ? (
    <Outlet />
  ) : (
    <Navigate to='/sign-in' />
  );
}
