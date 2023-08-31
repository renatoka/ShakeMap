import { useCallback, useEffect, useState } from 'react';
import Map, { MapRef } from 'react-map-gl';
import { PulsingDot, SubscribeModal } from '../../components/components';
import { RotatingSpeed } from '../../helpers/rotatingSpeed.services';
import { RouteErrorProps } from '../../interfaces/interfaces.types';
import { getMapboxToken } from '../../redux/actions';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { ErrorPage } from '../ErrorPage/ErrorPage';
import { Sidebar } from './components';

export const Main = () => {
  const dispatch = useAppDispatch();
  const { mapboxToken, loading, error } = useAppSelector(
    (state) => state.mapboxToken,
  );
  const { earthquakesData } = useAppSelector((state) => state.earthquakesData);
  const { rotating, projection, showSubscribeModal } = useAppSelector(
    (state) => state.settings,
  );
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
  }, [dispatch]);

  useEffect(() => {
    if (projection != 'globe') {
      setViewState({
        ...viewState,
        latitude: 0,
      });
    }
    setViewState({
      ...viewState,
      latitude: 20,
    });
  }, [projection]);

  useEffect(() => {
    switch (true) {
      case window.innerWidth < 768 && window.innerWidth > 425:
        setViewState({
          ...viewState,
          zoom: 0.9,
        });
        break;
      case window.innerWidth < 1024 && window.innerWidth > 768:
        setViewState({
          ...viewState,
          zoom: 1.2,
        });
        break;
      case window.innerWidth < 1440 && window.innerWidth > 1024:
        setViewState({
          ...viewState,
          zoom: 1.5,
        });
        break;
      default:
        setViewState({
          ...viewState,
          zoom: 1.8,
        });
        break;
    }
  }, [window.innerWidth]);

  useEffect(() => {
    let description = '';
    let title = 'Hold on!';

    switch (true) {
      case loading:
        description = 'We are loading the map for you.';
        break;
      case error:
        description = 'We are having some issues loading the map.';
        break;
      default:
        break;
    }

    if (description) {
      setActionModalData({ description, title });
    }
  }, [loading, error, mapboxToken, earthquakesData]);

  useEffect(() => {
    if (earthquakesData && earthquakesData.length > 0) {
      setActionModalData({ description: '', title: '' });
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
        center: [zoomInCoordinates.lon, zoomInCoordinates.lat],
        zoom: zoomInCoordinates.zoom,
      });
      setZoomInCoordinates(undefined);
    }
  }, [zoomInCoordinates, rotating, mapRef]);

  const spinGlobe = useCallback(() => {
    if (userInteracting) {
      return;
    }
    if (mapRef && !userInteracting && projection === 'globe') {
      const center = { ...mapRef.getCenter() };
      center.lng -= 0.35;
      mapRef.easeTo({
        center,
        animate: true,
        duration: 100,
        easing: (t: number) => t,
      });
    }
  }, [userInteracting, mapRef, projection]);

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
        {actionModalData?.title && actionModalData?.description && (
          <ErrorPage
            title={actionModalData.title}
            description={actionModalData.description}
          />
        )}
        {mapboxToken && (
          <>
            <Map
              {...viewState}
              projection={projection.split('-')[0] as any}
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
            <Sidebar
              setZoomInCoordinates={setZoomInCoordinates}
              zoomInCoordinates={zoomInCoordinates}
            />
          </>
        )}
      </div>
      {showSubscribeModal && <SubscribeModal />}
    </>
  );
};
