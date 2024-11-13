import {
  ArrowLeft,
  Camera,
  Heart,
  MessageCircle,
  Share2,
  Home,
  Search,
  Plus,
  ShoppingBag,
  MoreHorizontal,
  Music,
  User,
} from "lucide-react";

export default function Component() {
  return (
    <div className="relative w-[1080px] h-[1920px] overflow-hidden">
      {/* Top Navigation */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center">
        <div className="text-white">
          <ArrowLeft className="size-7" />
        </div>
        <div className="text-white">
          <Camera className="size-7" />
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col items-center gap-8">
        <div className="flex flex-col items-center">
          <div className="text-white">
            <Heart className="size-8" />
          </div>
          <span className="text-white text-sm mt-1">123K</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="text-white">
            <MessageCircle className="size-8" />
          </div>
          <span className="text-white text-sm mt-1">123</span>
        </div>
        <div className="text-white">
          <Share2 className="size-8" />
        </div>
      </div>

      {/* Bottom User Info */}
      <div className="absolute left-0 right-0 bottom-20 px-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="size-10 border-2 border-white">
              <User className="size-6" />
            </div>
            <span className="text-white font-semibold">username</span>
          </div>
          <div className="text-white">
            <MoreHorizontal className="size-6" />
          </div>
        </div>
        <p className="text-white text-sm mb-3">Lorem ipsum dolor sit amet</p>
        <div className="flex items-center gap-2">
          <Music className="size-4 text-white" />
          <span className="text-white text-sm">Audio</span>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-around items-center p-4 bg-black bg-opacity-50">
        <div className="text-white">
          <Home className="size-7" />
        </div>
        <div className="text-white">
          <Search className="size-7" />
        </div>
        <div className="text-white">
          <Plus className="size-7" />
        </div>
        <div className="text-white">
          <ShoppingBag className="size-7" />
        </div>
        <div className="size-7 border-2 border-white">
          <User className="size-5" />
        </div>
      </div>
    </div>
  );
}
