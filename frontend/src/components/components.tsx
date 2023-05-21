import { Marker } from 'react-map-gl';
import { useEffect, useMemo, useState } from 'react';
import { PulsingDotProps } from '../interfaces';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { Colouring } from '../helpers/colouring.services';
import Tippy from '@tippyjs/react';
import Select from 'react-select';
import {
  setProjectionAction,
  setShowSubscribeModalAction,
} from '../redux/actions';
import { motion } from 'framer-motion';
import CloseIcon from '@mui/icons-material/Close';
import { validate } from '../helpers/functions';
import { Inputs } from '../interfaces';
import { useTranslation } from 'react-i18next';
import CheckIcon from '@mui/icons-material/Check';

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
      backgroundColor: Colouring({ magnitude: mag }),
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
              backgroundColor: Colouring({ magnitude: mag }),
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
  const [errors, setErrors] = useState<Inputs>({
    firstName: '',
    lastName: '',
    email: '',
  });
  const [inputs, setInputs] = useState<Inputs>({
    firstName: '',
    lastName: '',
    email: '',
  });

  const handleSubmit = async (e: any) => {
    const isNotEmpty = Object.values(inputs).every((x) => x !== '');
    for (const [key, value] of Object.entries(inputs)) {
      if (value === '') {
        setErrors((prev) => ({ ...prev, [key]: t('GENERIC.REQUIRED_FIELD') }));
      }
    }
    if (isNotEmpty) {
      const isValid = validate(inputs);
      if (isValid) {
        setIsSubmitted(true);
        setErrors({ firstName: '', lastName: '', email: '' });
        setTimeout(() => {
          dispatch(setShowSubscribeModalAction(false));
        }, 2000);
      }
    }
  };

  return (
    <motion.div
      className="h-screen w-screen bg-black bg-opacity-50 backdrop-blur-sm z-50 fixed top-0 left-0"
      animate={{ opacity: 1 }}
      initial={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex flex-col items-center justify-center w-full h-full">
        <div className="flex flex-col justify-center items-center w-full h-full md:w-[560px] md:h-fit bg-black rounded-lg text-white p-3 gap-3 relative">
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
            <p className="text-sm md:text-base font-medium">
              {t('SUBSCRIBE_MODAL.DESCRIPTION')}
            </p>
          </>
          <div className="flex flex-col gap-2 w-full">
            <input
              type="text"
              placeholder={t('SUBSCRIBE_MODAL.FIRST_NAME') + '*'}
              className="bg-black text-white border-2 border-white rounded-md p-2 focus:outline-none"
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
              className="bg-black text-white border-2 border-white rounded-md p-2 focus:outline-none"
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
              className="bg-black text-white border-2 border-white rounded-md p-2 focus:outline-none"
              onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
            />
            {errors.email && (
              <p className="text-red-500 text-xs">{errors.email}</p>
            )}
            <button
              className="bg-white text-black rounded-md p-2 hover:bg-gray-200 active:bg-gray-300 focus:outline-none"
              onClick={handleSubmit}
            >
              {isSubmitted ? (
                <CheckIcon color="success" />
              ) : (
                t('SETTINGS.SUBSCRIBE')
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
