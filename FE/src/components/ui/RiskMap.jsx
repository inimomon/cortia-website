import React from "react";
import Map from "../map/Map";

const RiskMap = ({ data, selected, onProvinceClick }) => {
  return (
    <section className="w-full h-full">
      <div className="h-full">
        <RiskMap.MapArea
          data={data}
          selected={selected}
          onProvinceClick={onProvinceClick}
        />
      </div>
    </section>
  );
};

RiskMap.MapArea = ({ data, selected, onProvinceClick }) => {
  return (
    <div className="relative rounded-xl bg-blue-50 border border-blue-100 h-full w-full overflow-hidden shadow-inner">
      <Map data={data} selected={selected} onProvinceClick={onProvinceClick} />
    </div>
  );
};

export default RiskMap;
