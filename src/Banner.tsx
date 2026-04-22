import { useState } from "react";

import "./banner.css";

const delay = async (ms: number): Promise<void> => {
  const { promise, resolve } = Promise.withResolvers();
  setTimeout(resolve, ms);
  return promise;
};

export const Banner = () => {
  const [pending, setPenging] = useState(0);
  const [complete, setComplete] = useState(0);

  return (
    <div className="banner">
      <button
        type="button"
        onClick={async () => {
          setPenging((pending) => pending + 1);
          await delay(1000);
          setPenging((pending) => pending - 1);
          setComplete(complete + 1);
        }}
      >
        Купить
      </button>
      complete: {complete}, pending: {pending}
    </div>
  );
};
