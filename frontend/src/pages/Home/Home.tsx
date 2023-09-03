import { PulsingDot, SubscribeModal } from '../../components/components';
import { ErrorProps } from '../../interfaces/interfaces.types';
import { getMapboxToken } from '../../redux/actions';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { determineRotateSpeed } from '../../services/services';
import ErrorPage from '../Error/Error';
import { Sidebar } from './components';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useCallback, useEffect, useState } from 'react';
import { Map, MapRef } from 'react-map-gl';

const Main = () => {
  const dispatch = useAppDispatch();
  const { mapboxToken, loading, error } = useAppSelector(
    (state) => state.mapboxToken,
  );
  const { earthquakesData } = useAppSelector((state) => state.earthquakesData);
  const { rotating, projection, showSubscribeModal } = useAppSelector(
    (state) => state.settings,
  );

  const [actionModalData, setActionModalData] = useState<ErrorProps>();
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
    if (projection !== 'globe') {
      setViewState({ ...viewState, latitude: 0 });
    } else {
      setViewState({ ...viewState, latitude: 20 });
    }
  }, [projection]);

  useEffect(() => {
    if (window.innerWidth < 768 && window.innerWidth > 310) {
      setViewState({ ...viewState, zoom: 0.8 });
    } else if (window.innerWidth < 1024 && window.innerWidth > 768) {
      setViewState({ ...viewState, zoom: 1.2 });
    } else if (window.innerWidth < 1440 && window.innerWidth > 1024) {
      setViewState({ ...viewState, zoom: 1.5 });
    } else {
      setViewState({ ...viewState, zoom: 1.8 });
    }
  }, [window.innerWidth]);

  useEffect(() => {
    let description = '';
    let title = 'Hold on!';

    if (loading) {
      description = 'We are loading the map for you.';
    } else if (error) {
      description = 'We are having some issues loading the map.';
    }

    if (description) {
      setActionModalData({ description, title });
    }
  }, [loading, error]);

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
      setZoomInCoordinates(undefined);
    }
  }, [userInteracting, mapRef, projection]);

  useEffect(() => {
    if (rotating && !userInteracting) {
      const interval = setInterval(() => {
        spinGlobe();
      }, determineRotateSpeed({ zoom }));
      return () => clearInterval(interval);
    }
  }, [rotating, userInteracting, spinGlobe, zoom]);

  useEffect(() => {
    if (mapRef) {
      mapRef.on('mousedown', () => {
        setUserInteractingCallback(true);
      });
      mapRef.on('mouseup', () => {
        setUserInteractingCallback(false);
      });
      mapRef.on('touchstart', () => {
        setUserInteractingCallback(true);
      });
      mapRef.on('touchend', () => {
        setUserInteractingCallback(false);
      });
    }
  }, [mapRef, setUserInteractingCallback]);

  return (
    <>
      {loading || error ? (
        <ErrorPage
          title={actionModalData?.title!}
          description={actionModalData?.description!}
        />
      ) : null}
      {mapboxToken && (
        <>
          <Map
            {...viewState}
            projection={projection as unknown as any}
            onMove={(event) => setViewState(event.viewState)}
            onZoom={(event) => setZoom(event.viewState.zoom)}
            style={{ width: '100vw', height: '100vh' }}
            mapStyle="mapbox://styles/rkauric/clftyk5ry007v01o5hw5kdzpr"
            mapboxAccessToken={mapboxToken}
            // mapStyle="https://api.maptiler.com/maps/satellite/style.json?key=IZw1Xv9ZrICvrXjNks8s"
            reuseMaps={true}
            ref={(ref) => setMapRef(ref)}
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
      {showSubscribeModal && <SubscribeModal />}
    </>
  );
};

export default Main;
