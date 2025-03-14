import { Heart, Home, LogOut, MessageCircle, PlusSquare} from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { setAuthUser } from '@/redux/authSlice';
import CreatePost from './CreatePost';
import { setPosts, setSelectedPost } from '@/redux/postSlice';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import { clearNotifications } from '@/redux/rtnSlice';

const LeftSidebar = () => {
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const { likeNotification } = useSelector(store => store.realTimeNotification);
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

    const logoutHandler = async () => {
        try {
            const res = await axios.get('http://localhost:7000/api/v1/user/logout', { withCredentials: true });
            if (res.data.success) {
                dispatch(setAuthUser(null));
                dispatch(setSelectedPost(null));
                dispatch(setPosts([]));
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    const sidebarHandler = (textType) => {
        if (textType === 'Logout') {
            logoutHandler();
        } else if (textType === "Create") {
            setOpen(true);
        } else if (textType === "Profile") {
            navigate(`/profile/${user?._id}`);
        } else if (textType === "Home") {
            navigate("/");
        } else if (textType === 'Messages') {
            navigate("/chat");
        }
    };

    // Handle popover visibility and clear notifications only when closing
    const handleNotificationToggle = (open) => {
        setIsNotificationOpen(open);
        if (!open) {
            dispatch(clearNotifications()); // Clear notifications when closing popover
        }
    };

    const sidebarItems = [
        { icon: <Home />, text: "Home" },
        { icon: <MessageCircle />, text: "Messages" },
        { icon: <Heart />, text: "Notifications" },
        { icon: <PlusSquare />, text: "Create" },
        {
            icon: (
                <Avatar className='w-6 h-6'>
                    <AvatarImage src={user?.profilePicture} alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            ),
            text: "Profile"
        },
        { icon: <LogOut />, text: "Logout" },
    ];

    return (
        <div className='fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen'>
            <div className='flex flex-col'>
            <h1 className="mt-6 text-6xl font-extrabold tracking-tight drop-shadow-2xl text-transparent bg-clip-text bg-gradient-to-r from-[#f72585] via-[#7209b7] to-[#3a0ca3] font-[Poppins] italic">
  Pixora
</h1>


                <div>
                    {sidebarItems.map((item, index) => {
                        return (
                            <div
                                onClick={() => sidebarHandler(item.text)}
                                key={index}
                                className='flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3'
                            >
                                {item.icon}
                                <span>{item.text}</span>
                                {item.text === "Notifications" && (
                                    <Popover open={isNotificationOpen} onOpenChange={handleNotificationToggle}>
                                        <PopoverTrigger asChild>
                                            {likeNotification.length > 0 && (
                                                <Button size='icon' className="rounded-full h-5 w-5 !bg-red-600 hover:!bg-red-600 absolute bottom-6 left-6">
                                                    {likeNotification.length}
                                                </Button>
                                            )}
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            <div>
                                                {likeNotification.length === 0 ? (
                                                    <p>No new notifications</p>
                                                ) : (
                                                    likeNotification.map((notification) => (
                                                        <div key={notification.userId} className='flex items-center gap-2 my-2'>
                                                            <Avatar>
                                                                <AvatarImage src={notification.userDetails?.profilePicture} />
                                                                <AvatarFallback>CN</AvatarFallback>
                                                            </Avatar>
                                                            <p className='text-sm'>
                                                                <span className='font-bold'>{notification.userDetails?.username}</span> liked your post
                                                            </p>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
            <CreatePost open={open} setOpen={setOpen} />
        </div>
    );
};

export default LeftSidebar;