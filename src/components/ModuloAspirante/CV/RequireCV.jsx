import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { checkIfAspiranteHasCV } from '../../../servicios/cvService';
import { toast } from 'react-toastify';

const RequireCV = ({ children, userId }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const verifyCV = async () => {
      if (userId) {
        try {
          const hasCV = await checkIfAspiranteHasCV(userId);
          if (!hasCV) {
            toast.warning('Debes completar tu CV primero');
            navigate('/cv/new', { 
              state: { 
                userId, 
                isFirstTime: true,
                fromProtectedRoute: true 
              },
              replace: true
            });
          }
        } catch (error) {
          console.error('Error al verificar CV:', error);
          toast.error('Error al verificar tu CV');
        }
      }
    };

    verifyCV();
  }, [userId, navigate]);

  return children;
};

export default RequireCV;