import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Chip, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ReactSelect } from '../../../components/components';
import { Colouring } from '../../../helpers/colouring.services';
import { SidebarProps } from '../../../interfaces';
import {
  fetchAndGetEarthquakesByDate,
  getEarthquakes,
  setDisablePulsingAction,
  setLimitAction,
  setRotatingAction,
  setSelectedDateAction,
  setShowSubscribeModalAction,
} from '../../../redux/actions';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';

export const Sidebar = ({
  zoomInCoordinates,
  setZoomInCoordinates,
}: SidebarProps) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const { limit, selectedDate } = useAppSelector((state) => state.settings);
  const [locale, setLocale] = useState<string>();

  useEffect(() => {
    if (localStorage.getItem('locale') != null) {
      setLocale(localStorage.getItem('locale')!);
    } else {
      console.warn('Locale not found, setting to en-GB');
      setLocale('en-GB');
    }
  }, []);

  useEffect(() => {
    if (zoomInCoordinates) {
      setModalOpen(false);
    }
  }, [zoomInCoordinates]);

  const handleDateChange = async (date: Date) => {
    dispatch(setSelectedDateAction(new Date(date).toISOString()));
    const start = String(
      new Date(new Date(date).setHours(0, 0, 0, 0)).toISOString(),
    );
    const end = new Date(new Date(date).setHours(23, 59, 59, 0)).toISOString();
    await dispatch(
      fetchAndGetEarthquakesByDate({
        start,
        end,
        limit,
      }),
    );
  };

  return (
    <motion.div
      className="fixed bottom-0 lg:top-0 lg:left-0 bg-black bg-opacity-50 backdrop-blur-sm z-20 w-full lg:w-1/3 xl:w-1/4"
      initial={
        window.innerWidth < 1024
          ? { height: '5%', opacity: 1 }
          : { height: '100%', opacity: 1 }
      }
      animate={
        window.innerWidth < 1024
          ? { height: modalOpen ? '100%' : '7%', opacity: 1 }
          : { height: '100%', opacity: 1 }
      }
      transition={{ ease: 'easeInOut', duration: 0.5 }}
    >
      <div className="flex flex-col w-full h-full items-center justify-center gap-2 px-4 py-3 lg:pt-6">
        <div className={`${window.innerWidth >= 1024 ? 'hidden' : 'block'}`}>
          <button onClick={() => setModalOpen(!modalOpen)}>
            {modalOpen ? (
              <ExpandMoreIcon className="text-white" />
            ) : (
              <ExpandLessIcon className="text-white" />
            )}
          </button>
        </div>
        <>
          <div className="flex flex-col w-full h-full overflow-y-scroll">
            <div className="flex flex-col items-start justify-center mb-3">
              <div className="flex items-center w-full relative">
                <h1 className="text-white text-xl font-medium">
                  {t('HEADER.TITLE')}
                </h1>
                <div className="absolute right-0 top-0">
                  <LanguageSwitcher />
                </div>
              </div>
              <p className="text-white text-sm">
                {t('HEADER.SUBTITLE')}{' '}
                <Link
                  to={'https://www.seismicportal.eu/'}
                  target="_blank"
                  className="text-orange-500 font-medium"
                >
                  Seismic Portal Europe
                </Link>
              </p>
              <div className="flex w-full items-center gap-1">
                <p className="text-white text-sm font-medium">
                  {t('HEADER.DATE')}:{' '}
                </p>
                <DatePicker
                  onChange={handleDateChange}
                  value={String(
                    new Date(selectedDate).toLocaleDateString(locale),
                  )}
                  selected={new Date(selectedDate)}
                  className={
                    'bg-transparent text-white text-sm outline-none cursor-pointer w-fit'
                  }
                  maxDate={new Date()}
                  onKeyDown={(e) => {
                    e.preventDefault();
                  }}
                />
              </div>
            </div>
            <div className="overflow-y-scroll mt-auto" id="scrollbar-hide">
              <EarthquakeList setZoomInCoordinates={setZoomInCoordinates} />
            </div>
            <div className="mt-auto">
              <SettingsList />
            </div>
          </div>
        </>
      </div>
    </motion.div>
  );
};

export const EarthquakeList = ({ setZoomInCoordinates }: SidebarProps) => {
  const { rotating } = useAppSelector((state) => state.settings);
  const handleEarthquakeClick = useCallback(
    (earthquake: any) => () => {
      if (!rotating) {
        setZoomInCoordinates({
          lon: earthquake.lon,
          lat: earthquake.lat,
          zoom: 6,
        });
      }
    },
    [rotating, setZoomInCoordinates],
  );
  const { earthquakesData } = useAppSelector((state) => state.earthquakesData);

  const earthquakeElements = useMemo(
    () =>
      earthquakesData && earthquakesData.length > 0 ? (
        earthquakesData.map((earthquake: any) => (
          <div
            key={earthquake.unid}
            className="flex flex-col hover:bg-orange-500 hover:bg-opacity-30 hover:cursor-pointer rounded p-2"
            onClick={handleEarthquakeClick(earthquake)}
          >
            <h1 className="text-slate-300 text-xs font-medium">
              {new Date(earthquake.time).toLocaleTimeString()}
            </h1>
            <div className="flex justify-between items-center">
              <p className="text-white text-base font-bold">
                {earthquake.flynn_region}
              </p>
              <Chip
                label={'Magnitude ' + earthquake.mag.toFixed(1)}
                size="small"
                style={{
                  backgroundColor: Colouring({
                    magnitude: earthquake.mag,
                  }),
                }}
              />
            </div>
          </div>
        ))
      ) : (
        <div className="flex w-full h-full items-center justify-center">
          <CircularProgress size={80} color="warning" />
        </div>
      ),

    [handleEarthquakeClick, earthquakesData],
  );

  return <div className="flex w-full flex-col">{earthquakeElements}</div>;
};

export const SettingsList = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { limit, selectedDate } = useAppSelector((state) => state.settings);

  useEffect(() => {
    const start = String(
      new Date(new Date(selectedDate).setHours(0, 0, 0, 0)).toISOString(),
    );
    const end = String(
      new Date(new Date(selectedDate).setHours(23, 59, 59, 0)).toISOString(),
    );

    limit > 0
      ? dispatch(
          getEarthquakes({
            start,
            end,
            limit: limit,
          }),
        )
      : dispatch(
          getEarthquakes({
            start,
            end,
            limit: 20,
          }),
        );
  }, [limit, selectedDate]);

  return (
    <div className="w-full">
      <div className="flex flex-col w-full items-center gap-2">
        <div className="flex flex-col w-full md:mt-0">
          <div className="mb-3">
            <h1 className="text-white text-xl font-medium">
              {t('SETTINGS.TITLE')}
            </h1>
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <div>
                <h1 className="text-white text-lg font-medium">
                  {t('SETTINGS.NUMBER_OF_EARTHQUAKES')}
                </h1>
                <p className="text-gray-300 text-sm italic">
                  ({t('SETTINGS.DEFAULT')}: 20)
                </p>
              </div>
              <div className="flex items-end">
                <input
                  type="text"
                  className="w-8 text-center bg-transparent text-white text-lg font-medium border-b-2 border-white focus:outline-none outline-none"
                  defaultValue={limit ? limit : 20}
                  maxLength={3}
                  onInputCapture={(e) => {
                    dispatch(setLimitAction(parseInt(e.currentTarget.value)));
                  }}
                />
              </div>
            </div>
            <div className="flex justify-between">
              <div>
                <h1 className="text-white text-lg font-medium">
                  {t('SETTINGS.GLOBE_ROTATION')}
                </h1>
                <p className="text-gray-300 text-sm italic">
                  ({t('SETTINGS.DEFAULT')}: {t('GENERIC.NO')})
                </p>
              </div>
              <div className="flex items-end">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-center bg-transparent text-white text-lg font-medium border-b-2 border-white focus:outline-none"
                  onChange={(e) => {
                    dispatch(setRotatingAction(e.currentTarget.checked));
                  }}
                  checked={useAppSelector((state) => state.settings.rotating)}
                />
              </div>
            </div>
            <div className="flex justify-between">
              <div>
                <h1 className="text-white text-lg font-medium">
                  {t('SETTINGS.DOT_PULSING')}
                </h1>
                <p className="text-gray-300 text-sm italic">
                  ({t('SETTINGS.DEFAULT')}: {t('GENERIC.YES')})
                </p>
              </div>
              <div className="flex items-end">
                <input
                  type="checkbox"
                  className="w-5 h-5 text-center bg-transparent text-white text-lg font-medium border-b-2 border-white focus:outline-none"
                  onChange={(e) => {
                    dispatch(setDisablePulsingAction(e.currentTarget.checked));
                  }}
                  checked={useAppSelector((state) => state.settings.pulsing)}
                />
              </div>
            </div>
            <div className="flex justify-between">
              <div className="w-full">
                <h1 className="text-white text-lg font-medium">
                  {t('SETTINGS.PROJECTION')}
                </h1>
                <p className="text-gray-300 text-sm italic">
                  ({t('SETTINGS.DEFAULT')}: Globe)
                </p>
              </div>
              <div className="w-full mt-auto">
                <ReactSelect />
              </div>
            </div>
            <div className="w-full">
              <button
                className="w-full bg-transparent text-white text-lg font-medium border-[1px] hover:bg-orange-500 hover:border-orange-500 border-white py-2 px-4 rounded-md focus:outline-none active:bg-orange-700 active:border-orange-700"
                onClick={() => dispatch(setShowSubscribeModalAction(true))}
              >
                {t('SETTINGS.SUBSCRIBE')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
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
