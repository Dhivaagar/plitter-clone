import Form from "@/components/Form";
import Header from "@/components/Header";
import PostFeed from "@/components/posts/PostFeed";

export const metadata = {
  title: "Plitter - Home",
  description: "A Twitter clone with Next.js 14 and TypeScript.",
  icons: {
    icon: "/images/favicon.ico",
  },
};

export default function Home() {
  return (
    <>
    <Header label="Home" />
    <Form placeholder="What's happening?" />
    <PostFeed />
    </>
  );
}
