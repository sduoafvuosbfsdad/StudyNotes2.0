import * as React from 'react';
import { cn } from '@/lib/utils';

type NativeSliderProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value' | 'onChange'>;

export interface SliderProps extends NativeSliderProps {
  value: number;
  onValueChange?: (value: number) => void;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value, onValueChange, onChange, ...props }, ref) => {
    const handleChange = React.useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        onValueChange?.(Number(event.target.value));
        onChange?.(event);
      },
      [onChange, onValueChange]
    );

    return (
      <input
        ref={ref}
        type="range"
        value={value}
        onChange={handleChange}
        className={cn('w-full', className)}
        {...props}
      />
    );
  }
);

Slider.displayName = 'Slider';

export { Slider };
