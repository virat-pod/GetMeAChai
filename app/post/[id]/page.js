import React from "react";
import Post from "./component/singlePost";
import { fetchSinglePost } from "@/actions/postaction";
import { cache } from "react";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const post = await getPost(id);

  if (!post) return {};

  return {
    title: `${post.author.name} Post | Get Me A Chai`,
    description: post.content,
  };
}

const getPost = cache(async (id) => {
  return await fetchSinglePost(id);
});

const PostShow = async ({ params }) => {
  const { id } = await params;
  const posts = await getPost(id);

  return (
    <>
      <Post showPost={posts} />
    </>
  );
};

export default PostShow;
