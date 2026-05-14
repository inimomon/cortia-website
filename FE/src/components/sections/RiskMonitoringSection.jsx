import React from "react";
import RiskMap from "../ui/RiskMap";
import RiskTable from "../ui/RiskTable";

const RiskMonitoringSection = ({
  provinsiData,
  selected,
  setSelected,
  dotColor,
  skorColor,
}) => {
  return (
    <section className="grid md:grid-cols-2 gap-6 mb-10">
      <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
        <h3 className="font-semibold text-gray-800 p-4 border-b border-gray-100">
          Visualisasi Geografis Anggaran
        </h3>

        <div className="h-[400px]">
          <RiskMap
            data={provinsiData}
            selected={selected}
            onProvinceClick={setSelected}
          />
        </div>
      </div>

      <RiskTable
        data={provinsiData}
        selected={selected}
        setSelected={setSelected}
        dotColor={dotColor}
        skorColor={skorColor}
      />
    </section>
  );
};

export default RiskMonitoringSection;
