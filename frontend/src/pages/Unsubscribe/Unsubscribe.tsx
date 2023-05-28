import { useParams } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import { useEffect, useState } from 'react';
import { getUser, unsubscribeUser } from './helperFunctions';
import { CircularProgress } from '@mui/material';

export const UnsubscribePage = () => {
  const { token } = useParams<{ token: string }>();
  const [tokenData, setTokenData] = useState<any>({});
  const [user, setUser] = useState<any>({});
  const [unsubscribeSuccess, setUnsubscribeSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (token) {
      const decodedToken = jwt_decode(token);
      setTokenData(decodedToken);
    }
  }, [token]);

  useEffect(() => {
    (async () => {
      if (tokenData.id) {
        const user = await getUser(tokenData.id);
        if (user) {
          setUser(user);
        }
      }
    })();
  }, [tokenData]);

  useEffect(() => {
    (async () => {
      if (user.id) {
        const unsubscribe = await unsubscribeUser(user.id);
        if (unsubscribe) {
          setUnsubscribeSuccess(true);
        }
      }
    })();
  }, [user]);

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="flex flex-col items-center justify-center gap-2">
        {unsubscribeSuccess && user ? (
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-3xl font-medium text-center">
              Dear {user.firstName},
            </h1>
            <h2 className="text-xl text-center">
              We are sorry to see you go, but we respect your decision.
              <br />
              You have been unsubscribed from our mailing list.
            </h2>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2">
            <CircularProgress
              security="Unsubscribing"
              size={100}
              color="warning"
            />
          </div>
        )}
      </div>
    </div>
  );
};
