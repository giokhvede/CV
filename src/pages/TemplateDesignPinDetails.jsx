import React from "react";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import { getTemplateDetails } from "../api";
import { MainSpinner } from "../components";
import { FaHouse } from "react-icons/fa6";
import {
  BiHeart,
  BiSolidFolder,
  BiSolidFolderPlus,
  BiSolidHeart,
} from "react-icons/bi";
import useUser from "../hooks/useUser";
import { saveToCollections, saveToFavorites } from "../api";
import useTemplates from "../hooks/useTemplates";
import { TemplateDesignPin } from "../components";
import { AnimatePresence } from "framer-motion";

const TemplateDesignPinDetails = () => {
  const { templateID } = useParams();

  const { data, isError, isLoading, refetch } = useQuery(
    ["template", templateID],
    () => getTemplateDetails(templateID)
  );

  const { data: user, refetch: userRefetch } = useUser();

  const {
    data: templates,
    refetch: temp_Refetch,
    isLoading: temp_isLoading,
  } = useTemplates();

  const addToCollection = async (e) => {
    e.stopPropagation();
    await saveToCollections(user, data);
    userRefetch();
  };

  const addToFavorite = async (e) => {
    e.stopPropagation();
    await saveToFavorites(user, data);
    temp_Refetch();
    refetch();
  };

  if (isLoading) return <MainSpinner />;
  if (isError)
    return (
      <div className="w-fullh-[60vh] flex flex-col items-center justify-center">
        <p className="text-lg text-txtPrimary font-semibold">
          Error while fetching the data...Please try again later
        </p>
      </div>
    );

  return (
    <div className="w-full flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full flex items-center pb-8 gap-2">
        <Link
          to={"/"}
          className="flex items-center justify-center gap-2 text-txtPrimary"
        >
          <FaHouse />
        </Link>
        <p>/</p>
        <p>{data?.name}</p>
      </div>

      {/* design main section */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12">
        {/* design left section */}
        <div className="col-span-1  lg:col-span-8 flex flex-col items-start justify-start gap-4">
          {/* load template image */}
          <img
            className=" bg-gray-300 px-10 py-10 w-full h-auto object-contain rounded-md"
            src={data?.imageURL}
            alt="template img"
          />

          {/* title and other options */}
          <div className="w-full flex flex-col items-start justify-start gap-2">
            {/* title section */}
            <div className="w-full flex items-center justify-between">
              <p className="text-base text-txtPrimary font-semibold">
                {data?.title}
              </p>
              {data?.favorites?.length > 0 && (
                <div className="flex items-center justify-center gap-1">
                  <BiSolidHeart className="text-base text-red-500" />
                  <p className="text-base  font-semibold">
                    {data?.favorites?.length} likes
                  </p>
                </div>
              )}
            </div>
            {user && (
              <div className="flex items-center justify-center gap-3 flex-wrap">
                {user?.collection?.includes(data?._id) ? (
                  <React.Fragment>
                    <div
                      onClick={addToCollection}
                      className="flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 gap-2 cursor-pointer hover:bg-emerald-500 text-txtPrimary hover:text-white"
                    >
                      <BiSolidFolder className="text-base" />
                      <p className="text-sm whitespace-nowrap">
                        Remove from Collections
                      </p>
                    </div>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <div
                      onClick={addToCollection}
                      className="flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 gap-2 cursor-pointer hover:bg-emerald-500 text-txtPrimary hover:text-white"
                    >
                      <BiSolidFolderPlus className="text-base" />
                      <p className="text-sm  whitespace-nowrap ">
                        Add to Collections
                      </p>
                    </div>
                  </React.Fragment>
                )}
                {data?.favorites?.includes(user?.uid) ? (
                  <React.Fragment>
                    <div
                      onClick={addToFavorite}
                      className="flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 gap-2 cursor-pointer hover:bg-emerald-500 text-txtPrimary hover:text-white"
                    >
                      <BiSolidHeart className="text-base " />
                      <p className="text-sm whitespace-nowrap">
                        Remove from Favorites
                      </p>
                    </div>
                  </React.Fragment>
                ) : (
                  <React.Fragment>
                    <div
                      onClick={addToFavorite}
                      className="flex items-center justify-center px-4 py-2 rounded-md border border-gray-300 gap-2 cursor-pointer hover:bg-emerald-500 text-txtPrimary hover:text-white"
                    >
                      <BiHeart className="text-base " />
                      <p className="text-sm  whitespace-nowrap">
                        Add to Favorites
                      </p>
                    </div>
                  </React.Fragment>
                )}
              </div>
            )}
          </div>
        </div>

        {/* design right section */}
        <div className="col-span-1 lg:col-span-4 w-full flex flex-col items-center justify-start gap-6 px-3">
          {/* discover more section */}
          <div
            className="w-full h-72 bg-blue-200 rounded-md relative overflow-hidden"
            style={{
              background:
                "url(https://w0.peakpx.com/wallpaper/31/750/HD-wallpaper-cup-coffee-books-pen-laptop.jpg)",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.4)]">
              <Link
                to={"/"}
                className="px-4 py-2 rounded-md border-2 border-gray-50 text-white hover:bg-emerald-500"
              >
                Discover More
              </Link>
            </div>
          </div>
          {/* edit template section */}
          {user && (
            <Link
              to={`/resume/${data?.name}?templateID=${templateID}`}
              className="w-full px-4 py-3 rounded-md flex items-center justify-center bg-emerald-500 cursor-pointer"
            >
              <p className="text-white font-semibold text-lg">
                Edit This Template
              </p>
            </Link>
          )}

          {/* tags */}
          <div className="w-full flex items-center justify-start flex-wrap gap-2">
            {data?.tags?.map((tag, index) => (
              <p
                className="text-xs border border-gray-300 px-2 py-1 rounded-md whitespace-nowrap"
                key={index}
              >
                {tag}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* similar templates */}
      {templates.filter((temp) => temp._id !== data?._id)?.length > 0 && (
        <div className="w-full py-8 flex flex-col items-start justify-start gap-4">
          <p className="text-lg font-semibold text-txtDark">
            You might also like
          </p>
          <div className="w-full gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-col-4">
            <React.Fragment>
              <AnimatePresence>
                {templates
                  .filter((temp) => temp._id !== data?._id)
                  .map((template, index) => (
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
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateDesignPinDetails;
