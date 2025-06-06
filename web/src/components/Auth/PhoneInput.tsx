import { forwardRef } from 'react';
import { IMaskInput } from 'react-imask';

export const PhoneInput = forwardRef<HTMLInputElement, any>((props, ref) => (
  <IMaskInput
	  {...props}
    ref={ref}
    mask="+7 (000) 000-00-00"
    placeholder="+7 (___) ___-__-__"
  />
));
