"use client";
import { redirect } from "next/navigation";
import { useSession } from "next-auth/react";

import Header from "@/components/Header";
import NotificationsFeed from "@/components/NotificationsFeed";

const Notifications = () => {
  const { data } = useSession();
  if (!data?.user) {
    redirect("/");
  }
  return (
    <>
      <Header label="Notifications" showBackArrow />
      <NotificationsFeed />
    </>
  );
};

export default Notifications;
