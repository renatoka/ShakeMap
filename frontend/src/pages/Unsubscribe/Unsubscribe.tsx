import { getUser, unsubscribeUser } from '../../services/services';
import { CircularProgress } from '@mui/material';
import jwt_decode from 'jwt-decode';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

const Unsubscribe = () => {
  const { token } = useParams<{ token: string }>();
  const [tokenData, setTokenData] = useState<any>({});
  const [user, setUser] = useState<any>({});
  const [unsubscribeSuccess, setUnsubscribeSuccess] = useState<boolean>(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (token) {
      const decodedToken = jwt_decode(token);
      setTokenData(decodedToken);
    }
  }, [token]);

  useEffect(() => {
    (async () => {
      if (tokenData.id && token) {
        const user = await getUser(tokenData.id, token);
        if (user) {
          setUser(user);
        }
      }
    })();
  }, [tokenData]);

  useEffect(() => {
    (async () => {
      if (user.id && token) {
        const unsubscribe = await unsubscribeUser(user.id, token);
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
          <div className="flex flex-col items-center justify-center whitespace-pre-line">
            <h1 className="text-3xl font-medium text-center">
              {t('UNSUBSCRIBE_PAGE.TITLE', { firstName: user.firstName })}
            </h1>
            {!user.activeSubscription ? (
              <h2 className="text-xl text-center">
                {t('UNSUBSCRIBE_PAGE.ALREADY_UNSUBSCRIBED')}
              </h2>
            ) : (
              <h2 className="text-xl text-center">
                {t('UNSUBSCRIBE_PAGE.SUCCESS_MESSAGE')}
              </h2>
            )}
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

export default Unsubscribe;
