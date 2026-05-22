import { Dispatch, SetStateAction } from "react";

export const handleImageLoad = (
  index: number,
  stateSetter: Dispatch<SetStateAction<boolean[]>>,
) => {
  stateSetter((prevState) => {
    const updatedState = [...prevState];
    updatedState[index] = true;
    return updatedState;
  });
};
