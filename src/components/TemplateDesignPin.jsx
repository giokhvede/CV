import React, { useState } from "react";
import { AnimatePresence, delay, easeInOut, motion } from "framer-motion";
import { FadeInOutWithOpacity, scaleInOut } from "../animations/index";
import {
  BiFolderPlus,
  BiHeart,
  BiSolidFolderMinus,
  BiSolidFolderPlus,
  BiSolidHeart,
} from "react-icons/bi";
import useUser from "../hooks/useUser";
import { saveToCollections, saveToFavorites } from "../api";
import useTemplates from "../hooks/useTemplates";
import { useNavigate } from "react-router-dom";

const TemplateDesignPin = ({ data, index }) => {
  const { data: user, refetch: userRefetch } = useUser();

  const { refetch: temp_Refetch } = useTemplates();

  const [isHovered, setIsHovered] = useState(false);

  const navigate = useNavigate();

  const addToCollection = async (e) => {
    e.stopPropagation();
    await saveToCollections(user, data);
    userRefetch();
  };

  const addToFavorite = async (e) => {
    e.stopPropagation();
    await saveToFavorites(user, data);
    temp_Refetch();
  };

  const handleRouteNavigation = () => {
    navigate(`/resumeDetail/${data?._id}`, { replace: true });
  };

  return (
    <motion.div
      key={data?._id}
      {...scaleInOut(index)}
      transition={{ delay: index * 0.1, ease: easeInOut }}
    >
      <div
        className="w-full h-[500px] 2xl:h-[740px] rounded-md bg-gray-200 overflow-hidden relative"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={data?.imageURL}
          className="w-full h-full object-cover"
          alt="cv/resume template img"
        />

        <AnimatePresence>
          {isHovered && (
            <motion.div
              {...FadeInOutWithOpacity}
              onClick={handleRouteNavigation}
              className="absolute inset-0 bg-[rgba(0,0,0,0.4)] flex flex-col items-center justify-start px-4 py-3 z-50 cursor-pointer"
            >
              <div className="flex flex-col items-end justify-start w-full gap-8">
                <InnerBoxCard
                  label={
                    user?.collection?.includes(data?._id)
                      ? "Remove/Collections"
                      : "Add/Collections"
                  }
                  Icon={
                    user?.collection?.includes(data?._id)
                      ? BiSolidFolderMinus
                      : BiSolidFolderPlus
                  }
                  onHandle={addToCollection}
                />

                <InnerBoxCard
                  label={
                    data?.favorites?.includes(user?.uid)
                      ? "Remove/Favorites"
                      : "Add/Favorites"
                  }
                  Icon={
                    data?.favorites?.includes(user?.uid)
                      ? BiSolidHeart
                      : BiHeart
                  }
                  onHandle={addToFavorite}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

const InnerBoxCard = ({ label, Icon, onHandle }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div
      onClick={onHandle}
      className="w-10 h-10 rounded-md bg-gray-200 flex items-center justify-center hover:shadow-md relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Icon className="text-txtPrimary text-base" />
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.6, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.6, x: 50 }}
            className="px-2 py-2 rounded-md bg-gray-200 absolute -left-40 after:w-2 after:h-2 after:bg-gray-200 after:absolute after:-right-1 after:top-[14px] after:rotate-45 whitespace-nowrap"
          >
            <p className="text-sm text-txtPrimary whitespace-nowrap">{label}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TemplateDesignPin;
