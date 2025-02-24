// Based on loader from "@mantine/core"
import { Loader } from '@mantine/core';
import React, { Suspense } from 'react';

// this will show the animation
const LoaderCustom = () => {
  return (
    <Loader className="loader" size="xl" color="blue" type="dots" />
  );
};

const Loadable = (Component) => (props) => (
  <Suspense fallback={<LoaderCustom />}>
    <Component {...props} />
  </Suspense>
);

export default Loadable;