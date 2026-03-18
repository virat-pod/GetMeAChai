import React from "react";
import Post from "./component/singlePost"
import { fetchSinglePost } from "@/actions/postaction";
import { cache } from "react"; 

const getPost = cache(async (id) => {  
  return await fetchSinglePost(id)
})

const PostShow = async ({ params }) => {
  const { id } = await params;
  const posts = await getPost(id); 

  return (
    <>
     <Post showPost={posts}/>
    </>
  );
};

export default PostShow;

export async function generateMetadata({ params }) {
  const { id } = await params
  const post = await getPost(id)  

  if (!post) return {}  

  return {
    title: `${post.author.name} on Get Me A Chai`,
    description: post.content,
    openGraph: {
      title: `${post.author.name} on Get Me A Chai`,
      description: post.content,
      images: [post.image || "https://res.cloudinary.com/dt4qdszmp/image/upload/v1773570286/get-me-a-chai-logo_cpdcuh.png"],
    }
  }
}