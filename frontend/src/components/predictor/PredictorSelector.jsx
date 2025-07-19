import { ChevronDownIcon } from "@heroicons/react/24/outline";

const PredictorSelector = ({
  name,
  label,
  value,
  onChange,
  options,
  IconComponent,
  capitalizeOptions = false,
}) => {
  return (
    <div>
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
          value={value}
          onChange={onChange}
          className="block appearance-none w-full bg-white border border-gray-500 text-gray-800 py-2 px-10 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {capitalizeOptions
                ? option
                    .replace("_", " ")
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")
                : option}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="pointer-events-none absolute inset-y-0 right-3 flex items-center h-full w-5 text-gray-600" />
      </div>
    </div>
  );
};

export default PredictorSelector;
