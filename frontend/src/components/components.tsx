import { PulsingDotProps } from '../interfaces';
import { InputProps } from '../interfaces';
import {
  setProjectionAction,
  setShowSubscribeModalAction,
} from '../redux/actions';
import { createUser } from '../redux/actions/users-actions';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { colourMarker } from '../services/services';
import { validate } from '../services/services';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Tippy from '@tippyjs/react';
import { motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Marker } from 'react-map-gl';
import Select from 'react-select';

export const PulsingDot = ({
  lon,
  lat,
  mag,
  unid,
  depth,
  time,
}: PulsingDotProps) => {
  const { pulsing } = useAppSelector((state) => state.settings);

  const markerStyle = useMemo(() => {
    return {
      width: '12px',
      height: '12px',
      borderRadius: '50%',
      backgroundColor: colourMarker({ magnitude: mag }),
    };
  }, [mag]);

  return (
    <Marker longitude={lon} latitude={lat}>
      <Tippy
        content={
          <div className="flex flex-col gap-1">
            <p className="text-white text-sm font-medium">
              Magnitude: {mag.toFixed(1)}
            </p>
            <p className="text-white text-sm font-medium">
              Depth: {depth.toFixed(1)} km
            </p>
            <p className="text-white text-sm font-medium">
              Time: {new Date(time).toLocaleTimeString()}
            </p>
            <p className="text-white text-sm font-medium">
              Latitude: {lon.toFixed(4)}
            </p>
            <p className="text-white text-sm font-medium">
              Longitude: {lat.toFixed(4)}
            </p>
          </div>
        }
      >
        <div
          style={markerStyle}
          className="relative"
          data-tooltip-id={`tooltip-${unid}`}
        >
          <div
            className={`absolute top-0 left-0 border-2 border-white ${
              pulsing ? 'animate-ping' : 'animate-none'
            }`}
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: colourMarker({ magnitude: mag }),
            }}
          ></div>
        </div>
      </Tippy>
    </Marker>
  );
};

export const ReactSelect = () => {
  const dispatch = useAppDispatch();

  type OptionType = {
    value: string;
    label: string;
  };

  const options: OptionType[] = [
    { value: 'globe', label: 'Globe' },
    { value: 'albers', label: 'Albers' },
    { value: 'mercator', label: 'Mercator' },
    { value: 'naturalEarth', label: 'Natural Earth' },
  ];

  return (
    <Select
      options={options}
      isSearchable={false}
      defaultValue={options[0]}
      menuPlacement="top"
      styles={{
        control: (provided) => ({
          ...provided,
          backgroundColor: 'transparent',
          border: 'none',
          boxShadow: 'none',
        }),
        menu: (provided) => ({
          ...provided,
          backgroundColor: 'black',
        }),
        option: (provided, state) => ({
          ...provided,
          backgroundColor: state.isSelected ? '#F97316' : 'black',
          color: state.isSelected ? 'white' : 'white',
          '&:hover': {
            backgroundColor: '#F97316',
            color: 'white',
          },
        }),
        singleValue: (provided) => ({
          ...provided,
          color: 'white',
        }),
      }}
      onChange={(e: any) => {
        dispatch(setProjectionAction(e?.value));
      }}
    />
  );
};

export const SubscribeModal = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isFirstLoad, setIsFirstLoad] = useState<boolean>(true);
  const { error, user } = useAppSelector((state) => state.users);
  const [errors, setErrors] = useState<InputProps>({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [inputs, setInputs] = useState<InputProps>({
    firstName: '',
    lastName: '',
    email: '',
  });

  useEffect(() => {
    if (isFirstLoad) {
      return;
    }
    for (const [key, value] of Object.entries(inputs)) {
      if (value === '') {
        setErrors((prev) => ({ ...prev, [key]: t('GENERIC.REQUIRED_FIELD') }));
      }
    }
  }, [inputs, t, isFirstLoad]);

  const handleSubmit = async () => {
    setIsFirstLoad(false);
    const isNotEmpty = Object.values(inputs).every((x) => x !== '');
    if (isNotEmpty) {
      const validation = validate(inputs);
      if (validation.success) {
        setIsSubmitted(true);
        setErrors({
          firstName: '',
          lastName: '',
          email: '',
        });
        await dispatch(createUser(inputs));
      } else {
        validation.errors.forEach((err: any) => {
          setErrors((prev) => ({ ...prev, [err.path]: err.message }));
        });
      }
    }
  };

  useEffect(() => {
    if (!error && isSubmitted && user) {
      setTimeout(() => {
        dispatch(setShowSubscribeModalAction(false));
      }, 2000);
    }
  }, [user, error, dispatch]);

  return (
    <motion.div
      className="h-screen w-screen bg-black bg-opacity-50 backdrop-blur-sm z-50 fixed top-0 left-0"
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex flex-col items-center justify-center w-full h-full">
        <div className="flex flex-col justify-center w-full h-full md:w-[550px] md:h-fit bg-black md:rounded-lg p-4 gap-3 relative text-white">
          <div className="absolute top-0 right-0 m-4">
            <CloseIcon
              className="cursor-pointer"
              onClick={() => dispatch(setShowSubscribeModalAction(false))}
            />
          </div>
          <>
            <h1 className="text-2xl md:text-3xl font-bold whitespace-break-spaces">
              {t('SUBSCRIBE_MODAL.TITLE')}
            </h1>
          </>
          <div className="flex flex-col gap-2 w-full">
            <input
              type="text"
              placeholder={t('SUBSCRIBE_MODAL.FIRST_NAME') + '*'}
              className="border-[1px] rounded-md p-2 focus:outline-none bg-transparent"
              onChange={(e) =>
                setInputs({ ...inputs, firstName: e.target.value })
              }
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs">{errors.firstName}</p>
            )}
            <input
              type="text"
              placeholder={t('SUBSCRIBE_MODAL.LAST_NAME') + '*'}
              className="border-[1px] rounded-md p-2 focus:outline-none bg-transparent"
              onChange={(e) =>
                setInputs({ ...inputs, lastName: e.target.value })
              }
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs">{errors.lastName}</p>
            )}
            <input
              type="email"
              placeholder={t('SUBSCRIBE_MODAL.EMAIL') + '*'}
              className="border-[1px] rounded-md p-2 focus:outline-none bg-transparent"
              onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email}</p>
            )}
            <button
              className="bg-orange-500 hover:bg-orange-600 hover:border-orange-600 py-2 px-4 rounded-md focus:outline-none active:bg-orange-700 active:border-orange-700"
              onClick={handleSubmit}
            >
              {isSubmitted && !error ? <CheckIcon /> : t('SETTINGS.SUBSCRIBE')}
            </button>
            {error && <p className="text-red-500 text-xs">{error}</p>}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const languages = [
    {
      code: 'en',
      name: 'English',
      img: 'https://hatscripts.github.io/circle-flags/flags/gb.svg',
    },
    {
      code: 'de',
      name: 'Deutsch',
      img: 'https://hatscripts.github.io/circle-flags/flags/de.svg',
    },
    {
      code: 'es',
      name: 'Español',
      img: 'https://hatscripts.github.io/circle-flags/flags/es.svg',
    },
  ];

  return (
    <div
      className="rounded-full"
      onClick={() => setShowMenu(!showMenu)}
      tabIndex={-1}
      onBlur={() => setShowMenu(false)}
    >
      {showMenu ? (
        <div className="flex flex-col gap-2">
          {languages
            .filter((lang) => lang.code != i18n.language)
            .map((lang) => (
              <img
                src={lang.img}
                alt={lang.name}
                key={lang.code}
                className="w-6 h-6 lg:w-7 lg:h-7 transition-all duration-500 hover:scale-75 cursor-pointer"
                onClick={() => {
                  i18n.changeLanguage(lang.code);
                  localStorage.setItem('language', lang.code);
                  setShowMenu(false);
                }}
              />
            ))}
        </div>
      ) : (
        <img
          src={languages.filter((lang) => lang.code == i18n.language)[0].img}
          alt={languages.filter((lang) => lang.code == i18n.language)[0].name}
          className="w-6 h-6 lg:w-7 lg:h-7 transition-all duration-500 hover:scale-90 cursor-pointer"
        />
      )}
    </div>
  );
};
