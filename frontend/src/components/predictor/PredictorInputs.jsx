const PredictorInputs = ({
  name,
  label,
  value,
  onChange,
  IconComponent,
  required = true,
  step = "any",
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
          <IconComponent className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-600" />
        )}
        <input
          type="number"
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          className="w-full pl-10 pr-4 py-2 border border-gray-500 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 ease-in-out"
          required={required}
          step={step}
        />
      </div>
    </div>
  );
};

export default PredictorInputs;
