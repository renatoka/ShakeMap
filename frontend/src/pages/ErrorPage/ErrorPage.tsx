import { RouteErrorProps } from '../../interfaces';

export const ErrorPage = ({ title, description }: RouteErrorProps) => {
  return (
    <div className="flex justify-center items-center h-screen bg-black">
      <div className="flex flex-col justify-center items-center text-center font-montserrat">
        <h1 className="text-xl md:text-5xl text-white font-light">{title}</h1>
        <h2 className="text-xl md:text-3xl text-white font-light italic">
          {description}
        </h2>
      </div>
    </div>
  );
};
