import React from "react";
import { Route, Routes } from "react-router-dom";
import { templatesData } from "../utils/helpers";

const CreateResume = () => {
  return (
    <div className="w-full flex flex-col justify-start py-4 items-center">
      <Routes>
        {templatesData.map((template) => (
          <Route
            key={template?.id}
            path={`/${template.name}`}
            Component={template.component}
          />
        ))}
      </Routes>
    </div>
  );
};

export default CreateResume;
