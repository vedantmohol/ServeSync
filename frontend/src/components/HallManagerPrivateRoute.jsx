import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export default function HallManagerPrivateRoute(){
  const { currentUser } = useSelector((state) => state.user);

  return currentUser && currentUser.role === 'hall_manager' ? (
    <Outlet />
  ) : (
    <Navigate to='/sign-in' />
  );
}
