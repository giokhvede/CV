import React, { useEffect, useState } from "react";
import useUser from "../hooks/useUser";
import avatarIMG from "../assets/img/avatar.png";
import { AnimatePresence } from "framer-motion";
import { MainSpinner, TemplateDesignPin } from "../components";
import useTemplates from "../hooks/useTemplates";
import { Navigate } from "react-router-dom";
import { NoData } from "../assets";
import { useQuery } from "react-query";
import { getSavedResumes } from "../api";

const UserProfile = () => {
  const { data: user } = useUser();

  const [activeTab, setActiveTab] = useState("collections");

  const {
    data: templates,
    isLoading: temp_isLoading,
    isError: temp_isError,
  } = useTemplates();

  const { data: savedResumes } = useQuery(["savedResumes"], () =>
    getSavedResumes(user?.uid)
  );

  // useEffect(() => {
  //   if (!user) {
  //     Navigate("/auth", { replace: true });
  //   }
  // }, []);

  if (temp_isLoading) return <MainSpinner />;

  return (
    <div className="w-full flex flex-col items-center justify-start py-12">
      <div className="w-full h-72 bg-blue-50">
        <img
          src="https://t3.ftcdn.net/jpg/02/73/16/80/360_F_273168068_zU1a1HrWsLlAX9XkmbFPBKCColycMAsC.jpg"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="flex flex-col items-center justify-center gap-4">
          {user?.photoURL ? (
            <React.Fragment>
              <img
                src={user?.photoURL}
                className="w-24 h-24 rounded-full border-2 border-white -mt-12 shadow-md"
                alt="user profile picture"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            </React.Fragment>
          ) : (
            <React.Fragment>
              <img
                src={avatarIMG}
                className="w-24 h-24 rounded-full border-2 border-white -mt-12 shadow-md"
                alt="user profile picture"
                referrerPolicy="no-referrer"
                loading="lazy"
              />
            </React.Fragment>
          )}
          <p className="text-2xl text-txtDark">{user?.displayName}</p>
        </div>
        <div className="flex items-center justify-center mt-12">
          <div
            className={`px-4 py-2 rounded-md flex items-center justify-center gap-2 group cursor-pointer`}
            onClick={() => setActiveTab("collections")}
          >
            <p
              className={`text-base text-txtPrimary group-hover:text-blue-600 px-4 py-1 rounded-full ${
                activeTab === "collections" &&
                "bg-white shadow-md text-blue-600"
              }`}
            >
              Collections
            </p>
          </div>

          <div
            className={`px-4 py-2 rounded-md flex items-center justify-center gap-2 group cursor-pointer`}
            onClick={() => setActiveTab("resumes")}
          >
            <p
              className={`text-base text-txtPrimary group-hover:text-blue-600 px-4 py-1 rounded-full ${
                activeTab === "resumes" && "bg-white shadow-md text-blue-600"
              }`}
            >
              My Resumes
            </p>
          </div>
        </div>

        <div className="w-full grid grid-col-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-col-4 gap-2 px-4 py-6">
          <AnimatePresence>
            {activeTab === "collections" && (
              <React.Fragment>
                {user?.collection.length > 0 && user?.collection ? (
                  <RenderATemplate
                    templates={templates?.filter((template) =>
                      user?.collection?.includes(template?._id)
                    )}
                  />
                ) : (
                  <div className="col-span-12 w-full flex flex-col items-center justify-center gap-3">
                    <img
                      src={NoData}
                      className="w-32 h-auto object-contain"
                      alt=""
                    />
                    <p>No data</p>
                  </div>
                )}
              </React.Fragment>
            )}

            {activeTab === "resumes" && (
              <React.Fragment>
                {savedResumes?.length > 0 ? (
                  <RenderATemplate templates={savedResumes} />
                ) : (
                  <div className="col-span-12 w-full flex flex-col items-center justify-center gap-3">
                    <img
                      src={NoData}
                      className="w-32 h-auto object-contain"
                      alt=""
                    />
                    <p>No data</p>
                  </div>
                )}
              </React.Fragment>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const RenderATemplate = ({ templates }) => {
  return (
    <React.Fragment>
      <React.Fragment>
        <AnimatePresence>
          {templates &&
            templates.map((template, index) => (
              <div className="bg-gray-300 rounded-md px-10 py-10 z-0">
                <TemplateDesignPin
                  key={template?._id}
                  data={template}
                  index={index}
                />
              </div>
            ))}
        </AnimatePresence>
      </React.Fragment>
    </React.Fragment>
  );
};

export default UserProfile;
