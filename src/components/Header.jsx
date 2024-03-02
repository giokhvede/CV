import React, { useState } from "react";
import useUser from "../hooks/useUser";
import { Link } from "react-router-dom";
import { Logo } from "../assets";
import { AnimatePresence, motion } from "framer-motion";
import { PuffLoader } from "react-spinners";

import { HiLogout } from "react-icons/hi";
import { slideUpDownMenu, FadeInOutWithOpacity } from "../animations/";
import { auth } from "../config/firebase.config";
import { useQueryClient } from "react-query";
import { adminIds } from "../utils/helpers";
import useFilters from "../hooks/useFilters";

const Header = () => {
  const { data, isLoading, isError } = useUser();
  const [isMenu, setIsMenu] = useState(false);

  const queryClient = useQueryClient();

  const { data: FilterData } = useFilters();

  const signOutUser = async () => {
    await auth.signOut().then(() => {
      queryClient.setQueryData("user", null);
    });
  };

  const handleSearchTerm = (e) => {
    const previousState = queryClient.getQueryData("globalFilter");
    const updatedState = { ...previousState, searchTerm: e.target.value };
    queryClient.setQueryData("globalFilter", updatedState);
  };

  const clearFilter = () => {
    const previousState = queryClient.getQueryData("globalFilter");
    const updatedState = { ...previousState, searchTerm: "" };
    queryClient.setQueryData("globalFilter", updatedState);
  };

  return (
    <header className="w-full flex items-center justify-between px-4 py-3 lg:px-8 border-b border-gray-300 bg-bgPrimary z-50 gap-12 sticky top-0">
      {/* logo */}
      <Link to={"/"}>
        <img src={Logo} alt="Logo" className="w-12 h-auto object-contain" />
      </Link>

      {/* input */}
      <div className="flex-1 border border-gray-300 px-4 py-1 rounded-md flex items-center justify-between bg-gray-200">
        <input
          value={FilterData?.searchTerm ? FilterData?.searchTerm : ""}
          onChange={handleSearchTerm}
          type="text"
          placeholder="Search Here..."
          className="flex-1 h-10 bg-transparent text-base font-semibold outline-none border-none"
        />
        <AnimatePresence>
          {FilterData?.searchTerm.length > 0 && (
            <motion.div
              onClick={clearFilter}
              {...FadeInOutWithOpacity}
              className="w-8 h-8 flex items-center justify-center bg-gray-300 rounded-md cursor-pointer active:scale-95 duration-150"
            >
              <p className="text-2xl text-black">X</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* profile section */}
      <AnimatePresence>
        {isLoading ? (
          <PuffLoader color="#498FCD" size={40} />
        ) : (
          <React.Fragment>
            {data ? (
              <motion.div
                {...FadeInOutWithOpacity}
                className="relative"
                onClick={() => setIsMenu(!isMenu)}
              >
                {data?.photoURL ? (
                  <div className="w-12 h-12 rounded-md relative flex items-center justify-center cursor-pointer">
                    <img
                      src={data?.photoURL}
                      referrerPolicy="no-referrer"
                      className="w-full h-full rounded-md object-cover"
                      alt="user"
                    />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-md relative flex items-center justify-center bg-blue-700 shadow-md cursor-pointer">
                    <p className="text-lg text-white">{data.email[0]}</p>
                  </div>
                )}
                {/* dropdown menu */}
                <AnimatePresence>
                  {isMenu && (
                    <motion.div
                      {...slideUpDownMenu}
                      className="absolute px-4 py-2 rounded-md bg-white right-0 top-14 flex flex-col items-center justify-center gap-2 w-64 pt-8"
                      onMouseLeave={() => setIsMenu(false)}
                    >
                      {data?.photoURL ? (
                        <div className="w-16 h-16 rounded-full relative flex flex-col items-center justify-center">
                          <img
                            src={data?.photoURL}
                            referrerPolicy="no-referrer"
                            className="w-full h-full rounded-full object-cover"
                            alt="user"
                          />
                        </div>
                      ) : (
                        <div className="w-16 h-16 rounded-full relative flex items-center justify-center bg-blue-700 shadow-full">
                          <p className="text-3xl text-white">{data.email[0]}</p>
                        </div>
                      )}

                      {data?.displayName && (
                        <p className="text-lg text-txtDark">
                          {data.displayName}
                        </p>
                      )}

                      {/* menu */}
                      <div className="w-full flex flex-col items-start gap-3 pt-1">
                        <Link
                          className="text-txtLight hover:text-txtDark text-base whitespace-nowrap"
                          to={`/profile/${data.uid}`}
                        >
                          My Account
                        </Link>
                        {adminIds.includes(data?.uid) && (
                          <Link
                            className="text-txtLight hover:text-txtDark text-base whitespace-nowrap"
                            to={"/template/create"}
                          >
                            Add New Template
                          </Link>
                        )}

                        <div
                          className="w-full px-2 py-2 border-t border-gray-300 flex items-center justify-between group cursor-pointer"
                          onClick={signOutUser}
                        >
                          <p className="group-hover:text-txtDark text-txtLight">
                            Sign Out
                          </p>
                          <HiLogout className="group-hover:text-txtDark text-txtLight" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <Link to={"/auth"}>
                <motion.button
                  {...FadeInOutWithOpacity}
                  className="px-4 py-2 rounded-md border border-gray-300 bg-gray-200 hover:shadow-md active:scale-95 duration-150"
                  type="button"
                >
                  Login
                </motion.button>
              </Link>
            )}
          </React.Fragment>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
