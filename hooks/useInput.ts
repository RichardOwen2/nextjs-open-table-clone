import { useState } from 'react';

export default function useInput(defaultParams: string = ""): [input: string, onChangeInput: (e: React.ChangeEvent<any>) => void] {
  const [input, setInput] = useState(defaultParams);

  const onChangeInput = (e: React.ChangeEvent<any>): void => {
    setInput(e.target.value);
  }

  return [input, onChangeInput];
}   