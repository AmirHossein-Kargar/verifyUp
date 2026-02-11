import React, { memo } from 'react';

export const countries = Object.freeze([
  { code: 'EE', name: 'Estonia', nameFa: 'استونی' },
  { code: 'GB', name: 'United Kingdom', nameFa: 'انگلستان' },
]);

function CountrySelect({
  id,
  value,
  onChange,
  disabled = false,
  required = false,
  label = 'انتخاب کشور سیمکارت',
  placeholder = 'کشور را انتخاب کنید',
}) {
  return (
    <div>
      <label htmlFor={id} className="block mb-2.5 text-sm font-medium text-heading">
        {label}
        {required && <span className="text-red-500 ms-1">*</span>}
      </label>

      <select
        id={id}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        className={`
          block w-full px-3 py-2.5 text-sm rounded-base shadow-xs
          bg-neutral-secondary-medium border border-default-medium text-heading
          focus:ring-brand focus:border-brand
          disabled:opacity-60 disabled:cursor-not-allowed
        `}
      >
        <option value="">{placeholder}</option>

        {countries.map(({ code, name, nameFa }) => (
          <option key={code} value={code}>
            {name} ({nameFa})
          </option>
        ))}
      </select>
    </div>
  );
}

export default memo(CountrySelect);
