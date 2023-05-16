import { useCallback, useEffect, useState } from 'react';
import Map, { MapRef } from 'react-map-gl';
import { PulsingDot } from '../../components/components';
import { RotatingSpeed } from '../../helpers/rotatingSpeed.services';
import { RouteErrorProps } from '../../interfaces/interfaces.types';
import { getEarthquakes, getMapboxToken } from '../../redux/actions';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { ErrorPage } from '../ErrorPage/ErrorPage';
import { Sidebar } from '../components';

export const Main = () => {
  const dispatch = useAppDispatch();
  const { mapboxToken, loading, error } = useAppSelector(
    (state) => state.mapboxToken,
  );
  const { earthquakesData } = useAppSelector((state) => state.earthquakesData);
  const { rotating, projection } = useAppSelector((state) => state.settings);
  const [actionModalData, setActionModalData] = useState<RouteErrorProps>();

  const [mapRef, setMapRef] = useState<MapRef | null>(null);
  const [userInteracting, setUserInteracting] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(1.5);
  const [zoomInCoordinates, setZoomInCoordinates] = useState<{
    lon: number;
    lat: number;
    zoom: number;
  }>();
  const [viewState, setViewState] = useState({
    longitude: 0,
    latitude: 20,
    zoom: zoom,
  });

  useEffect(() => {
    dispatch(getMapboxToken());
    dispatch(getEarthquakes({ limit: 20 }));
  }, [dispatch]);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setViewState({
        ...viewState,
        zoom: 0.9,
      });
    } else {
      setViewState({
        ...viewState,
        zoom: 1.8,
      });
    }
  }, [window.innerWidth]);

  useEffect(() => {
    if (loading) {
      setActionModalData({
        description: 'We are loading the map for you.',
        title: 'Hold on!',
      });
    }
    if (error) {
      setActionModalData({
        description: 'We are having some issues loading the map.',
        title: 'Hold on!',
      });
    }
  }, [loading, error]);

  useEffect(() => {
    if (!mapboxToken) {
      setActionModalData({
        description: 'Hold on, we are trying to fix this issue.',
        title: 'Hold on!',
      });
    }
  }, [mapboxToken]);

  useEffect(() => {
    if (!earthquakesData) {
      setActionModalData({
        description: 'Hold on, we are trying to fix this issue.',
        title: 'Hold on!',
      });
    }
  }, [earthquakesData]);

  const setUserInteractingCallback = useCallback(
    (value: boolean | ((prevState: boolean) => boolean)) => {
      setUserInteracting(value);
    },
    [],
  );

  useEffect(() => {
    if (zoomInCoordinates && !rotating && mapRef) {
      mapRef.flyTo({
        center: [
          zoomInCoordinates.lon as number,
          zoomInCoordinates.lat as number,
        ],
        zoom: zoomInCoordinates.zoom as number,
      });
      setZoomInCoordinates(undefined);
    }
  }, [zoomInCoordinates, rotating, mapRef]);

  const spinGlobe = useCallback(() => {
    if (userInteracting) {
      return;
    }
    if (mapRef && !userInteracting) {
      const center = { ...mapRef.getCenter() };
      center.lng -= 0.35;
      mapRef.easeTo({
        center,
        animate: true,
        duration: 100,
        easing: (t: number) => t,
      });
    }
  }, [userInteracting, mapRef]);

  useEffect(() => {
    if (rotating && !userInteracting) {
      const interval = setInterval(() => {
        spinGlobe();
      }, RotatingSpeed({ zoom }));
      return () => clearInterval(interval);
    }
  }, [rotating, userInteracting, spinGlobe, zoom]);

  useEffect(() => {
    if (!mapRef) {
      return;
    }
    mapRef?.on('mousedown', () => {
      setUserInteractingCallback(true);
    });
    mapRef?.on('mouseup', () => {
      setUserInteractingCallback(false);
    });
    mapRef?.on('touchstart', () => {
      setUserInteractingCallback(true);
    });
    mapRef?.on('touchend', () => {
      setUserInteractingCallback(false);
    });
  }, [mapRef, setUserInteractingCallback]);

  return (
    <>
      <div>
        {loading ||
          error ||
          !mapboxToken ||
          (!earthquakesData && (
            <ErrorPage description={actionModalData?.description!} title={''} />
          ))}
        {earthquakesData && earthquakesData.length > 0 && mapboxToken && (
          <>
            <Map
              {...viewState}
              projection={projection}
              optimizeForTerrain={true}
              onMove={(event) => setViewState(event.viewState)}
              onZoom={(event) => setZoom(event.viewState.zoom)}
              style={{ width: '100vw', height: '100vh' }}
              mapStyle="mapbox://styles/rkauric/clftyk5ry007v01o5hw5kdzpr"
              mapboxAccessToken={mapboxToken}
              ref={(map) => setMapRef(map)}
              reuseMaps={true}
            >
              {earthquakesData &&
                earthquakesData.length > 0 &&
                earthquakesData.map((earthquake: any) => (
                  <PulsingDot key={earthquake.id} {...earthquake} />
                ))}
            </Map>
          </>
        )}
      </div>
      <Sidebar
        setZoomInCoordinates={setZoomInCoordinates}
        zoomInCoordinates={zoomInCoordinates}
      />
    </>
  );
};
