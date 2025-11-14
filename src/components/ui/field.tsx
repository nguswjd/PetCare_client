type FieldProps = {
  label?: string;
  placeholder?: string;
};

function Field({ label, placeholder }: FieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <h3 className="text-sm font-medium text-black">{label}</h3>
      <div className="flex justify-between items-center w-full px-4 py-3 border rounded-md border-gray-3">
        {placeholder}
      </div>
    </div>
  );
}

export default Field;
