import  { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { Link, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AtSign, Heart, MessageCircle } from 'lucide-react';
import { toggleFollowing, setUserProfile } from "@/redux/authSlice";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const userId = params.id;
  const navigate = useNavigate();
  useGetUserProfile(userId);

  const [activeTab, setActiveTab] = useState('posts');

  const { userProfile, user } = useSelector((store) => store.auth);

  const isLoggedInUserProfile = user?._id === userProfile?._id;
  const isFollowing = user?.following?.includes(userProfile?._id);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleMessageClick = (userId) => {
    navigate('/chat', { state: { userId } });
  };

  // ✅ Handle follow/unfollow
  const handleFollowToggle = async () => {
    try {
      const res = await axios.post(
        `https://pixora-2.onrender.com/api/v1/user/followorunfollow/${userProfile._id}`,{},
      //formData,
        { withCredentials: true,
         // Make sure token is available and correct
        }
      );

      if (res.data.success) {
        // ✅ Update Redux state (this updates the logged-in user's following list)
        dispatch(toggleFollowing(userProfile._id));

        // ✅ Refresh userProfile state after follow/unfollow
        const updatedProfile = await axios.get(`https://pixora-2.onrender.com/api/v1/user/${userProfile._id}/profile`,{}, {
          withCredentials: true,
          
        });
        dispatch(setUserProfile(updatedProfile.data.user));
      }
    } catch (error) {
      console.error('Failed to toggle follow:', error);
    }
  };

  const displayedPost = activeTab === 'posts' ? userProfile?.posts : userProfile?.bookmarks;

  return (
    <div className="flex max-w-5xl justify-center mx-auto pl-10">
      <div className="flex flex-col gap-20 p-8">
        <div className="grid grid-cols-2">
          {/* Profile Avatar */}
          <section className="flex items-center justify-center">
            <Avatar className="h-32 w-32">
              <AvatarImage
                src={userProfile?.profilePicture}
                alt="profilephoto"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>

          {/* Profile Info */}
          <section>
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <span>{userProfile?.username}</span>
                {isLoggedInUserProfile ? (
                  <>
                    <Link to="/account/edit">
                      <Button variant='secondary' className='hover:bg-gray-200 h-8'>Edit profile</Button>
                    </Link>
                  </>
                ) : (
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={handleFollowToggle}
                      className={`h-8 ${
                        isFollowing
                          ? 'bg-gray-300 hover:bg-gray-400' 
                          : 'bg-[#7209b7] hover:bg-[#3a0ca3] text-white'
                      }`}
                    >
                      {isFollowing ? 'Unfollow' : 'Follow'}
                    </Button>

                    {isFollowing && (
                      <Button 
                      onClick={() => handleMessageClick(user._id)}
                      className="h-8 bg-gray-200 hover:bg-gray-300 text-black">
                        Message
                      </Button>
                    )}
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className='flex items-center gap-4'>
                <p><span className='font-semibold'>{userProfile?.posts.length} </span>posts</p>
                <p><span className='font-semibold'>{userProfile?.followers.length} </span>followers</p>
                <p><span className='font-semibold'>{userProfile?.following.length} </span>following</p>
              </div>

              {/* Bio */}
              <div className='flex flex-col gap-1'>
                <span className='font-semibold'>{userProfile?.bio || 'bio here...'}</span>
                <Badge className='w-fit' variant='secondary'>
                  <AtSign /> <span className='pl-1'>{userProfile?.username}</span>
                </Badge>
              </div>
            </div>
          </section>
        </div>

        {/* Posts Section */}
        <div className='border-t border-t-gray-200'>
          <div className='flex items-center justify-center gap-40 text-sm'>
            <span
              className={`py-3 cursor-pointer ${
                activeTab === 'posts' ? 'font-bold' : ''
              }`}
              onClick={() => handleTabChange('posts')}
            >
              POSTS
            </span>
            <span
              className={`py-3 cursor-pointer ${
                activeTab === 'saved' ? 'font-bold' : ''
              }`}
              onClick={() => handleTabChange('saved')}
            >
              SAVED
            </span>
          </div>

          {/* Display Posts */}
          <div className='grid grid-cols-3 gap-1'>
            {displayedPost?.map((post) => (
              <div key={post?._id} className='relative group cursor-pointer'>
                <img
                  src={post.image}
                  alt='postimage'
                  className='rounded-sm my-2 w-full aspect-square object-cover'
                />
                <div className='absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                  <div className='flex items-center text-white space-x-4'>
                    <button className='flex items-center gap-2 hover:text-gray-300'>
                      <Heart />
                      <span>{post?.likes.length}</span>
                    </button>
                    <button className='flex items-center gap-2 hover:text-gray-300'>
                      <MessageCircle />
                      <span>{post?.comments.length}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;