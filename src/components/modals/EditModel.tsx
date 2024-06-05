"use client";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

import useCurrentUser from "@/hooks/useCurrentUser";
import useEditModal from "@/hooks/useEditModal";
import useUser from "@/hooks/useUser";
import Modal from "../Modal";
import Input from "../Input";
import ImageUpload from "../ImageUpload";

const EditModel = () => {
  const { data: currentUser } = useCurrentUser();
  const { mutate: mutateFetchedUser } = useUser(currentUser?.id);   
  const editModel = useEditModal();

  const [profileImage, setProfileImage] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    setProfileImage(currentUser?.profileImage);
    setCoverImage(currentUser?.coverImage);
    setName(currentUser?.name);
    setUsername(currentUser?.username);
    setBio(currentUser?.bio);
  }, [
    currentUser?.profileImage,
    currentUser?.coverImage,
    currentUser?.name,
    currentUser?.username,
    currentUser?.bio,
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = useCallback(async () => {
    try {
        setIsLoading(true);

        await axios.patch('/api/edit', {
            name,
            username,
            bio,
            profileImage,
            coverImage,
        });
        mutateFetchedUser();

        toast.success('Updated');
        editModel.onClose();
    } catch (error) {
        toast.error("Something went wrong");
        console.log(error);
    } finally {
        setIsLoading(false);
    }
  }, [name, username, bio, profileImage, coverImage, mutateFetchedUser, editModel]);

  const bodyContent = (
    <div className="flex flex-col gap-4">
        <ImageUpload 
          value={profileImage}
          disabled={isLoading}
          onChange={(image) => setProfileImage(image)}
          label="Upload profile image"
        />
        <ImageUpload
          value={coverImage}
          disabled={isLoading}
          onChange={(image) => setCoverImage(image)}
          label="Upload cover image"
        />
      <Input
        placeholder="Name"
        onChange={(event) => setName(event.target.value)}
        value={name}
        disabled={isLoading}
      />
      <Input
        placeholder="Username"
        onChange={(event) => setUsername(event.target.value)}
        value={username}
        disabled={isLoading}
      />
      <Input
        placeholder="Bio"
        onChange={(event) => setBio(event.target.value)}
        value={bio}
        disabled={isLoading}
      />
    </div>
  );

  return <Modal 
    disabled={isLoading}
    isOpen={editModel.isOpen}
    title="Edit your Profile"
    actionLabel="Save"
    onClose={editModel.onClose}
    onSubmit={onSubmit}
    body={bodyContent}
  />;
};

export default EditModel;
