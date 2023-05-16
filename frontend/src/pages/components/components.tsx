import { Chip, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import { Link } from 'react-router-dom';
import { CapitalizeString } from '../../helpers/capitalize.services';
import { Colouring } from '../../helpers/colouring.services';
import { SidebarProps } from '../../interfaces';
import {
  fetchAndGetEarthquakesByDate,
  getEarthquakes,
  setDisablePulsingAction,
  setLimitAction,
  setProjectionAction,
  setRotatingAction,
  setSelectedDateAction,
} from '../../redux/actions';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export const Sidebar = ({
  zoomInCoordinates,
  setZoomInCoordinates,
}: SidebarProps) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const { limit, selectedDate } = useAppSelector((state) => state.settings);

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
      className="fixed bottom-0 lg:top-0 lg:left-0 lg:max-w-[450px] w-full bg-black bg-opacity-50 backdrop-blur-sm z-20"
      initial={
        window.innerWidth <= 1024
          ? { height: '5%', opacity: 1 }
          : { height: '100%', opacity: 1 }
      }
      animate={
        window.innerWidth <= 1024
          ? { height: modalOpen ? '100%' : '5%', opacity: 1 }
          : { height: '100%', opacity: 1 }
      }
      transition={{ ease: 'easeInOut', duration: 0.5 }}
    >
      <div className="flex flex-col w-full h-full items-center gap-2 px-6 py-6 pt-0 lg:pt-6">
        <div className={`${window.innerWidth >= 1024 ? 'hidden' : 'block'}`}>
          <button className="mt-2" onClick={() => setModalOpen(!modalOpen)}>
            {modalOpen ? (
              <ExpandMoreIcon className="text-white" />
            ) : (
              <ExpandLessIcon className="text-white" />
            )}
          </button>
        </div>
        <>
          <div className="flex flex-col w-full h-full overflow-y-scroll gap-3">
            <div className="flex flex-col items-start justify-center">
              <div className="flex items-center">
                <h1 className="text-white text-xl font-medium">
                  Worldwide Seismic Activity
                </h1>
              </div>
              <p className="text-white text-sm">
                Data provided by{' '}
                <Link
                  to={'https://www.seismicportal.eu/'}
                  target="_blank"
                  className="text-orange-500 font-medium"
                >
                  Seismic Portal Europe
                </Link>
              </p>
              <div className="flex items-center gap-2">
                <p className="text-white text-sm font-medium">Date: </p>
                <DatePicker
                  onChange={handleDateChange}
                  value={String(new Date(selectedDate).toLocaleDateString())}
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
            <div className="overflow-y-scroll" id="scrollbar-hide">
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
            <div className="flex justify-between items-center lg:flex-col md:items-start xl:flex-row">
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
        <div className="flex justify-center items-center h-full w-full">
          <CircularProgress size={80} color="warning" />
        </div>
      ),

    [handleEarthquakeClick, earthquakesData],
  );

  return <div className="flex w-full flex-col">{earthquakeElements}</div>;
};

export const SettingsList = () => {
  const [projection, setProjection] = useState<string>();
  const projections = [
    'albers',
    'equalEarth',
    'equirectangular',
    'mercator',
    'lambertConformalConic',
    'naturalEarth',
    'winkelTripel',
    'globe',
  ];

  const dispatch = useAppDispatch();
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

  useEffect(() => {
    projection &&
      projection != '' &&
      projections.includes(projection) &&
      dispatch(setProjectionAction(projection));
  }, [projection]);

  return (
    <div className="w-full rounded-b-lg block">
      <div className="flex flex-col w-full h-full items-center gap-2">
        <div className="flex flex-col w-full h-full md:mt-0">
          <div className="mb-3">
            <h1 className="text-white text-2xl font-medium">
              Project Settings
            </h1>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between">
              <div>
                <h1 className="text-white text-lg font-medium">
                  Number of earthquakes
                </h1>
                <p className="text-gray-300 text-sm italic">(Default: 20)</p>
              </div>
              <div className="flex items-end gap-2">
                <input
                  type="text"
                  className="w-8 text-center bg-transparent text-white text-lg font-medium border-b-2 border-white focus:outline-none"
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
                  Globe Rotation
                </h1>
                <p className="text-gray-300 text-sm italic">(Default: No)</p>
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
                <h1 className="text-white text-lg font-medium">Dot Pulsing</h1>
                <p className="text-gray-300 text-sm italic">(Default: Yes)</p>
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
                <h1 className="text-white text-lg font-medium">Projection</h1>
                <p className="text-gray-300 text-sm italic">
                  (Default: Globe,{' '}
                  <Link
                    to={
                      'https://visgl.github.io/react-map-gl/docs/api-reference/map#projection'
                    }
                    target="_blank"
                    className="underline"
                  >
                    Types
                  </Link>
                  )
                </p>
              </div>
              <div className="flex items-end">
                <input
                  type="text"
                  className="text-right w-full bg-transparent text-white text-lg font-medium border-b-2 border-white focus:outline-none"
                  defaultValue={CapitalizeString(
                    useAppSelector((state) => state.settings.projection),
                  )}
                  onChange={(e) => {
                    setProjection(e.currentTarget.value);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
