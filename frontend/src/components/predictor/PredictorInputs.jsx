const PredictorInputs = ({
  name,
  label,
  value,
  onChange,
  IconComponent,
  type = "text",
  required = false,
  step = "any",
}) => {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-gray-700 text-sm font-bold mb-2 items-center space-x-2"
      >
        {IconComponent && <IconComponent className="h-5 w-5 text-gray-500" />}
        <span>{label}</span>
      </label>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-150 ease-in-out"
        required={required}
        step={step} 
      />
    </div>
  );
};

export default PredictorInputs;
