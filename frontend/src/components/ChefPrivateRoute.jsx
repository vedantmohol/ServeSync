import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';

export default function ChefPrivateRoute(){
  const { currentUser } = useSelector((state) => state.user);

  return currentUser && currentUser.role === 'chef' ? (
    <Outlet />
  ) : (
    <Navigate to='/sign-in' />
  );
}
