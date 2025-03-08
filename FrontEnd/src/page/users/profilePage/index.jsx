import { memo } from "react";

const ProfilePage = () => {
  const profile = [
    {
      img: "https://www.pngmart.com/files/23/Profile-PNG-Photo.png",
      name: "Đặng Thành Hưng",
      phone: "0348910968",
      email: "dth052k4@gmail.com",
    },
  ];
  return (
    <>
      <div className="max-w-screen-xl grid grid-cols-5 mx-auto mt-5 space-x-2">
        <div className="col-span-2">
          <div className="bg-white w-full mr-5">
            {profile.map((items, key) => (
              <div className="flex gap-5">
                <div>
                  <img
                    src={items.img}
                    alt=""
                    className="w-[200px] h-[200px] object-cover"
                  />
                </div>
                <div className="flex flex-col gap-5">
                  <p>{items.name}</p>
                  <p>{items.email}</p>
                  <p>{items.phone}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-3">
          <div className="bg-white w-full p-5">
            <div className="flex flex-col">
              <label className="text-xl m-1">
                Họ và tên: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="pl-2 py-1 border shadow border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập họ và tên"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xl m-1">
                Email: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="pl-2 py-1 border shadow border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập họ và tên"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xl m-1">
                Số điện thoại: <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="pl-2 py-1 border shadow border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nhập họ và tên"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(ProfilePage);
