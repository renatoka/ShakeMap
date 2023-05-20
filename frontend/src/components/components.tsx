import { Marker } from 'react-map-gl';
import { useMemo } from 'react';
import { PulsingDotProps } from '../interfaces';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { Colouring } from '../helpers/colouring.services';
import Tippy from '@tippyjs/react';
import Select from 'react-select';
import { setProjectionAction } from '../redux/actions';

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
