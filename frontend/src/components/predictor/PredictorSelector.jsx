import { ChevronDownIcon } from "@heroicons/react/24/outline";

const PredictorSelector = ({
  name,
  label,
  value,
  onChange,
  options,
  IconComponent,
  capitalizeOptions = false,
  ...props
}) => {
  return (
    <div className="flex flex-col">
      <label
        htmlFor={name}
        className="block text-gray-800 text-sm font-semibold mb-2"
      >
        {label}
      </label>
      <div className="relative">
        {IconComponent && (
          <IconComponent className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-600 pointer-events-none" />
        )}
        <select
          name={name}
          id={name}
          value={value === null ? "" : value}
          onChange={onChange}
          className="block appearance-none w-full bg-white border border-gray-500 text-gray-800 py-2 px-10 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
          required
          {...props}
        >
          <options value="" disabled>
            Select {label.toLowerCase()}
          </options>
          {options.map((option, index) => {
            const optionValue =
              typeof option === "object" ? option.value : option;
            const optionLabel =
              typeof option === "object"
                ? option.label
                : capitalizeOptions
                ? option
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (c) => c.toUpperCase())
                : option.replace(/_/g, " ");
            return (
              <option key={index} value={optionValue}>
                {optionLabel}
              </option>
            );
          })}
        </select>
        <ChevronDownIcon className="pointer-events-none absolute inset-y-0 right-3 flex items-center h-full w-5 text-gray-600" />
      </div>
    </div>
  );
};

export default PredictorSelector;
