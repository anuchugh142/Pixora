import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { toggleFollowing, setUserProfile } from '@/redux/authSlice';
import axios from 'axios';

const SuggestedUsers = () => {
  const dispatch = useDispatch();
  const suggestedUsers = useSelector(store => store.auth?.suggestedUsers) || [];
  const followingList = useSelector(store => store.auth?.user?.following) || [];
  const user = useSelector(store => store.auth?.user);

  // ✅ Split into Followed and Suggested Users using filter()
  const followedUsers = suggestedUsers.filter(user => followingList.includes(user._id));
  const nonFollowedUsers = suggestedUsers.filter(user => !followingList.includes(user._id));

  const handleFollowToggle = async (targetUserId) => {
    try {
      const res = await axios.post(
        `http://localhost:7000/api/v1/user/followorunfollow/${targetUserId}`,
        {},
        { withCredentials: true }
      );

      if (res.data.success) {
        // ✅ Update Redux state to reflect follow/unfollow state
        dispatch(toggleFollowing(targetUserId));

        // ✅ Update followers count locally
        const updatedSuggestedUsers = suggestedUsers.map(user => {
          if (user._id === targetUserId) {
            const updatedFollowers = followingList.includes(targetUserId)
              ? user.followers.filter(id => id !== user._id) // Remove follower
              : [...user.followers, user._id]; // Add follower

            return {
              ...user,
              followers: updatedFollowers
            };
          }
          return user;
        });

        // ✅ Update suggested users in Redux state
        dispatch(setUserProfile({ ...user, suggestedUsers: updatedSuggestedUsers }));
      }
    } catch (error) {
      console.error('Failed to toggle follow:', error);
    }
  };

  return (
    <div className='my-10 flex flex-col h-[calc(100vh-100px)]'>
      {/* 🔵 Followed Users Section */}
      <div className='mb-6'>
        <h1 className='font-semibold text-gray-600'>Users You Follow</h1>
        <div className='flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200'>
          {followedUsers.map((user) => (
            <div key={user._id} className='flex items-center justify-between my-5 mx-5 gap-4'>
              <div className='flex items-center gap-2'>
                <Link to={`/profile/${user?._id}`}>
                  <Avatar>
                    <AvatarImage src={user?.profilePicture} alt="post_image" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <h1 className='font-semibold text-sm'>
                    <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
                  </h1>
                  <span className='text-gray-600 text-sm'>{user?.bio || ''}</span>
                </div>
              </div>
              <span
                className="text-xs font-bold cursor-pointer text-gray-500"
                onClick={() => handleFollowToggle(user._id)}
              >
                Following
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 🔴 Suggested Users Section */}
      <div>
        <h1 className='font-semibold text-gray-600'>Suggested for you</h1>
        <div className='flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200'>
          {nonFollowedUsers.map((user) => (
            <div key={user._id} className='flex items-center justify-between my-5 mx-5 gap-4'>
              <div className='flex items-center gap-2'>
                <Link to={`/profile/${user?._id}`}>
                  <Avatar>
                    <AvatarImage src={user?.profilePicture} alt="post_image" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <h1 className='font-semibold text-sm'>
                    <Link to={`/profile/${user?._id}`}>{user?.username}</Link>
                  </h1>
                  <span className='text-gray-600 text-sm'>{user?.bio || ''}</span>
                </div>
              </div>
              <span
                className="text-xs font-bold cursor-pointer text-[#7209b7] hover:text-[#3a0ca3]"
                onClick={() => handleFollowToggle(user._id)}
              >
                Follow
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuggestedUsers;