import React, { useState } from "react";
import { MdLayersClear } from "react-icons/md";
import { AnimatePresence, motion } from "framer-motion";
import { slideUpDownWithScale } from "../animations";
import { FiltersData } from "../utils/helpers";
import useFilters from "../hooks/useFilters";
import { useQueryClient } from "react-query";

const Filters = () => {
  const [isClearHover, setIsClearHover] = useState(false);

  const { data: FilterData, isLoading, isError } = useFilters();

  const queryClient = useQueryClient();

  const handleFilterValue = (value) => {
    const previousState = queryClient.getQueryData("globalFilter");
    const updatedState = { ...previousState, searchTerm: value };
    queryClient.setQueryData("globalFilter", updatedState);
  };

  const clearFilter = () => {
    const previousState = queryClient.getQueryData("globalFilter");
    const updatedState = { ...previousState, searchTerm: "" };
    queryClient.setQueryData("globalFilter", updatedState);
  };

  return (
    <div className="w-full flex items-center justify-start">
      <div
        className="border border-gray-300 rounded-md px-3 py-2 mr-2 cursor-pointer group hover:shadow-md bg-gray-200 relative"
        onMouseEnter={() => setIsClearHover(true)}
        onMouseLeave={() => setIsClearHover(false)}
        onClick={clearFilter}
      >
        <MdLayersClear className="text-xl" />

        <AnimatePresence>
          {isClearHover && (
            <motion.div
              {...slideUpDownWithScale}
              className="absolute -top-6 -left-2 bg-white shadow-md rounded-md px-2 py-1"
            >
              <p className="text-xs whitespace-nowrap">Clear all</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-full flex items-center justify-between overflow-x-scroll scrollbar-none gap-2">
        {FiltersData &&
          FiltersData.map((item) => (
            <div
              onClick={() => handleFilterValue(item.value)}
              key={item.id}
              className={`border border-gray-300 rounded-md px-6 py-2 cursor-pointer group hover:shadow-md ${
                FilterData?.searchTerm === item.value && "bg-gray-300 shadow-md"
              }`}
            >
              <p className="text-sm text-txtPrimary group-hover:text-txtDark whitespace-nowrap">
                {item.label}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Filters;
