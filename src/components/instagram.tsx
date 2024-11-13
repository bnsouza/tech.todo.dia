import {Heart, MessageCircle, Send, Bookmark, Music, ChevronDown} from "lucide-react";

export default function Component() {
  return (
    <div className="relative w-[375px] h-[812px] bg-black overflow-hidden rounded-[40px] shadow-xl border-4 border-gray-300">
      {/* Phone frame */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 375 812"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <rect width="375" height="812" rx="40" fill="white" />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M125 34C125 31.7909 126.791 30 129 30H246C248.209 30 250 31.7909 250 34C250 36.2091 248.209 38 246 38H129C126.791 38 125 36.2091 125 34Z"
          fill="black"
        />
        <circle cx="281" cy="34" r="4" fill="black" />
      </svg>
      {/* Content area (where your video will go) */}
      <div className="absolute inset-0 bg-gray-200 overflow-hidden">
        {/* Your video content will go here */}
        <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-4xl font-bold">
          Your Video Here
        </div>
      </div>
      0,46182266
      {/* Instagram Reel UI overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Status bar */}
        <div className="h-10 bg-black bg-opacity-50" />

        {/* Top bar */}
        <div className="absolute top-14 left-5 right-5 flex justify-between items-center text-white">
          <span className="text-lg font-semibold">Reels</span>
          <ChevronDown className="w-6 h-6" />
        </div>

        {/* Right sidebar */}
        <div className="absolute right-4 bottom-24 flex flex-col items-center space-y-6 text-white">
          <div className="flex flex-col items-center">
            <Heart className="w-8 h-8" />
            <span className="text-xs mt-1">87.5K</span>
          </div>
          <div className="flex flex-col items-center">
            <MessageCircle className="w-8 h-8" />
            <span className="text-xs mt-1">1,024</span>
          </div>
          <div className="flex flex-col items-center">
            <Send className="w-8 h-8" />
          </div>
          <div className="flex flex-col items-center">
            <Bookmark className="w-8 h-8" />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="absolute left-4 right-14 bottom-6 text-white">
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 bg-gray-500 rounded-full mr-2" />
            <span className="font-semibold mr-2">username</span>
            <div className="px-2 py-1 border border-white rounded-md text-xs">Follow</div>
          </div>
          <p className="text-sm mb-2">Check out this amazing Reel! #awesome #content</p>
          <div className="flex items-center">
            <Music className="w-4 h-4 mr-2" />
            <span className="text-xs">Original Audio - username</span>
          </div>
        </div>

        {/* Home indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-5 flex justify-center items-center">
          <div className="w-32 h-1 bg-white rounded-full" />
        </div>
      </div>
    </div>
  );
}
