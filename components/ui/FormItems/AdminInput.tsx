const AdminInput = (props: any) => {
  const { Icon } = props;

  return (
    <div className="relative flex items-center gap-4 overflow-hidden border-gray-200 border rounded-sm focus-within:border-blue-500 focus-within:outline-none focus-within:ring-1 focus-within:ring-blue-500/10">
      {Icon && (
        <span className="pl-2">
          <Icon className=" text-gray-400" />
        </span>
      )}
      <input
        type="text"
        {...props}
        // placeholder={props.placeholder}
        className="w-full px-3 py-3 border-0 outline-none"
      />
    </div>
  );
};

export default AdminInput;
