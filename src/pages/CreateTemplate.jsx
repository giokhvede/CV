import React, { useEffect, useState } from "react";
import { FaTrash, FaUpload } from "react-icons/fa6";
import { PuffLoader } from "react-spinners";
import { toast } from "react-toastify";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { storage } from "../config/firebase.config";
import { setDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../config/firebase.config";
import { progress } from "framer-motion";
import { adminIds, initialTags } from "../utils/helpers";
import { serverTimestamp } from "firebase/firestore";
import useTemplates from "../hooks/useTemplates";
import { useNavigate } from "react-router-dom";
import useUser from "../hooks/useUser";

const CreateTemplate = () => {
  const [formData, setFormData] = useState({
    title: "",
    imageUrl: null,
  });

  const [imageAsset, setImageAsset] = useState({
    isImageLoading: false,
    uri: null,
    progress: 0,
  });

  const [selectedTags, setSelectedTags] = useState([]);

  const {
    data: templates,
    isLoading: templateIsLoading,
    isError: templateIsError,
    refetch: templateRefetch,
  } = useTemplates();

  const { data: user, isLoading } = useUser();

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevRec) => ({ ...prevRec, [name]: value }));
  };

  const handleFileSelect = async (e) => {
    setImageAsset((prevAsset) => ({ ...prevAsset, isImageLoading: true }));
    const file = e.target.files[0];

    if (file && isAllowed(file)) {
      const storageRef = ref(storage, `Templates/${Date.now()}-${file.name}}`);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          setImageAsset((prevAsset) => ({
            ...prevAsset,
            progress: (snapshot.bytesTransferred / snapshot.totalBytes) * 100,
          }));
        },
        (error) => {
          if (error.message.includes("storage/unauthorized")) {
            toast.error(`Error: Authorization Revoked`);
          } else {
            toast.error(`Error: ${error.message}`);
          }
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageAsset((prevAsset) => ({
              ...prevAsset,
              uri: downloadURL,
            }));
          });

          toast.success("image uploaded");
          setInterval(() => {
            setImageAsset((prevAsset) => ({
              ...prevAsset,
              isImageLoading: false,
            }));
          }, 2000);
        }
      );
    } else {
      toast.info("Invalid file Format");
    }
  };

  const deleteAnImageObject = async () => {
    setInterval(() => {
      setImageAsset((prevAsset) => ({
        ...prevAsset,
        progress: 0,
        uri: null,
      }));
    }, 2000);
    const deleteRef = ref(storage, imageAsset.uri);
    deleteObject(deleteRef).then(() => {
      toast.success("image Removed");
    });
  };

  const isAllowed = (file) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    return allowedTypes.includes(file.type);
  };

  const handleSelectedTags = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((selected) => selected !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const pushToServer = async () => {
    const timestamp = serverTimestamp();
    const id = `${Date.now()}`;
    const _doc = {
      _id: id,
      title: formData.title,
      imageURL: imageAsset.uri,
      tags: selectedTags,
      name:
        templates && templates.length > 0
          ? `Template${templates.length + 1}`
          : "Template1",
      timestamp: timestamp,
    };

    await setDoc(doc(db, "templates", id), _doc)
      .then(() => {
        setFormData((prevData) => ({ ...prevData, title: "", imageUrl: "" }));
        setImageAsset((prevAsset) => ({ ...prevAsset, uri: null }));
        setSelectedTags([]);
        templateRefetch();
        toast.success("Data pushed to the server");
      })
      .catch((err) => {
        toast.error(`Error : ${err.message}`);
      });
  };

  const removeTemplate = async (template) => {
    const deleteRef = ref(storage, template?.imageURL);
    await deleteObject(deleteRef).then(async () => {
      await deleteDoc(doc(db, "templates", template?._id))
        .then(() => {
          toast.success("Template Deleted from Server");
          templateRefetch();
        })
        .catch((err) => {
          toast.error(`Error : ${err.message}`);
        });
    });
  };

  useEffect(() => {
    if (!isLoading && !adminIds.includes(user?.uid)) {
      navigate("/", { replace: true });
    }
  }, [user, isLoading]);

  return (
    <div className="w-full px-4 lg:px-10 2xl:px-32 py-4 grid grid-cols-1 lg:grid-cols-12">
      {/* left container */}
      <div className="col-span-12 lg:col-span-4 2xl:col-span-3 flex flex-1 items-center justify-start flex-col gap-4 px-2">
        <div className="w-full">
          <p className="text-lg text-txtPrimary">Create a new Template</p>
        </div>
        {/* template ID section */}
        <div className="w-full flex items-center justify-end">
          <p className="text-sm text-txtLight uppercase font-semibold ">
            TempID : {""}
          </p>
          <p className="text-sm text-txtDark capitalize font-bold">
            {templates && templates.length > 0
              ? `Template${templates.length + 1}`
              : "Template1"}
          </p>
        </div>
        {/* template title section */}
        <input
          className="w-full px-4 py-3 rounded-md bg-transparent border border-gray-300 text-lg text-txtPrimary focus:text-txtDark focus:shadow-md outline-none"
          type="text"
          name="title"
          placeholder="Template Title"
          value={formData.title}
          onChange={handleInputChange}
        />
        {/* file uploader section */}
        <div className="w-full bg-gray-100 backdrop-blur-md h-[420px] lg:h-[580px] 2xl:h-[700px] rounded-md border-2 border-dotted border-gray-300 cursor-pointer flex items-center justify-center">
          {imageAsset.isImageLoading ? (
            <React.Fragment>
              <div className="flex flex-col items-center justify-center gap-4">
                <PuffLoader color="#498FCD" size={40} />
                <p>{imageAsset?.progress.toFixed(2)}%</p>
              </div>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {!imageAsset?.uri ? (
                <React.Fragment>
                  <label className="w-full cursor-pointer h-full">
                    <div className="flex flex-col items-center justify-center h-full w-full">
                      <div className="flex flex-col items-center justify-center cursor-pointer gap-4">
                        <FaUpload className="text-2xl" />
                        <p className="text-lg text-txtLight">Click to upload</p>
                      </div>
                    </div>

                    <input
                      type="file"
                      className="w-0 h-0"
                      accept=".jpeg,.jpg,.png"
                      onChange={handleFileSelect}
                    />
                  </label>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  <div className="relative w-full h-full overflow-hidden rounded-md">
                    <img
                      src={imageAsset.uri}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      alt=""
                    />

                    {/* delete uploaded picture */}
                    <div
                      className="absolute top-4 right-4 w-8 h-8 rouunded-md flex items-center justify-center cursor-pointer bg-red-500"
                      onClick={deleteAnImageObject}
                    >
                      <FaTrash />
                    </div>
                  </div>
                </React.Fragment>
              )}
            </React.Fragment>
          )}
        </div>

        {/* Tags Section */}
        <div className="w-full flex items-center justify-around flex-wrap gap-2">
          {initialTags.map((tag, index) => (
            <div
              key={index}
              className={`border border-gray-300 px-2 py-1 rounded-md cursor-pointer ${
                selectedTags.includes(tag) ? "bg-blue-500 text-white" : ""
              }`}
              onClick={() => handleSelectedTags(tag)}
            >
              <p className="text-xs">{tag}</p>
            </div>
          ))}
        </div>

        {/* save button */}
        <button
          type="button"
          className="w-full bg-blue-700 rounded-md py-3"
          onClick={pushToServer}
        >
          Save
        </button>
      </div>

      {/* right container */}
      <div className="col-span-12 lg:col-span-8 2xl:col-span-9 px-2 w-full flex-1 py-4">
        {templateIsLoading ? (
          <React.Fragment>
            <div className="w-full h-full flex items-center justify-center">
              <PuffLoader color="#498FCD" size={40} />
            </div>
          </React.Fragment>
        ) : (
          <React.Fragment>
            {templates && templates.length > 0 ? (
              <React.Fragment>
                <div className="w-full h-full grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-4">
                  {templates?.map((template) => (
                    <div
                      key={template._id}
                      className="w-full h-[450px] rounded-md overflow-hidden relative"
                    >
                      <img
                        src={template?.imageURL}
                        alt="Template"
                        className="w-full h-full object-cover"
                      />

                      {/* delete template button */}
                      <div
                        className="absolute top-4 right-4 w-8 h-8 rouunded-md flex items-center justify-center cursor-pointer bg-red-500"
                        onClick={() => removeTemplate(template)}
                      >
                        <FaTrash />
                      </div>
                    </div>
                  ))}
                </div>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <div className="w-full h-full flex items-center justify-center">
                  <PuffLoader color="#498FCD" size={40} />
                  <p className="text-xl tracking-wider capitalize text-txtPrimary">
                    No data
                  </p>
                </div>
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </div>
    </div>
  );
};

export default CreateTemplate;
