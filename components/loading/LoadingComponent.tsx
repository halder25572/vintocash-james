

const OrbitSpinner = () => {
  return (
    <div className="relative w-20 h-20">
      {/* First orbiting dot */}
      <div className="absolute inset-0 animate-spin">
        <div className="absolute top-0 left-1/2 -ml-2 w-4 h-4 bg-[#D93E39] rounded-full"></div>
      </div>
      
      {/* Second orbiting dot */}
      <div className="absolute inset-0 animate-spin" style={{ animationDuration: '1.5s' }}>
        <div className="absolute bottom-0 left-1/2 -ml-2 w-4 h-4 bg-[#ff5550] rounded-full"></div>
      </div>
      
      {/* Third orbiting dot */}
      <div className="absolute inset-0 animate-spin" style={{ animationDuration: '2s' }}>
        <div className="absolute left-0 top-1/2 -mt-2 w-4 h-4 bg-[#D93E39] rounded-full"></div>
      </div>
    </div>
  );
};

export default OrbitSpinner;