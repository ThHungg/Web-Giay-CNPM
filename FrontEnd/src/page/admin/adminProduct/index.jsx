import { memo, useState } from "react";

const AdminProduct = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sizeList, setSizeList] = useState([{ id: 1 }]);

  const addSizeField = () => {
    setSizeList([...sizeList, { id: sizeList.length + 1 }]);
  };
  const apartSizeField = (id, e) => {
    e.preventDefault();
    if (sizeList.length > 1) {
      setSizeList(sizeList.filter((item) => item.id !== id));
    } else {
      alert("Bạn phải để lại ít nhất một size");
    }
  };

  const CreateModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 flex flex-col gap-4 w-1/2 shadow-lg rounded-xl">
        <h1 className="text-2xl font-bold text-center">Thêm sản phẩm mới</h1>
        <form action="" className="space-y-3">
          <div className="grid grid-cols-2 gap-x-6">
            {/* col-1 */}
            <div className="">
              <div className="flex flex-col gap-1">
                <p className="text-xl font-bold">Name</p>
                <input
                  type="text"
                  className="border w-full p-2 rounded-lg"
                  placeholder=""
                />
              </div>

              {/* <div className="flex gap-2 justify-center items-center ">
            <p className="text-xl font-bold">Type</p>
            <input
              type="text"
              className="border w-full p-2 rounded-lg"
              placeholder=""
            />
          </div> */}

              <div className="flex flex-col gap-1">
                <p className="text-xl font-bold">Brand</p>
                <select className="border w-full p-2 rounded-lg">
                  <option>Nike</option>
                  <option>Adidas</option>
                </select>
              </div>

              {/* <div className="flex flex-col gap-1">
            <p className="text-xl font-bold">Description</p>
            <input
              type="text"
              className="border w-full p-2 rounded-lg"
              placeholder=""
            />
          </div> */}

              <div className="flex flex-col gap-1">
                <p className="text-xl font-bold">Price</p>
                <input
                  type="text"
                  className="border w-full p-2 rounded-lg"
                  placeholder=""
                />
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-xl font-bold">Discount</p>
                <input
                  type="text"
                  className="border w-full p-2 rounded-lg"
                  placeholder=""
                />
              </div>
            </div>

            {/* col-2 */}
            <div className="">
              {/* Description */}
              <div className="flex flex-col gap-1">
                <p className="text-xl font-bold">Description</p>
                <textarea
                  rows={2}
                  className="border w-full p-2 rounded-lg"
                ></textarea>
              </div>
              {/* Size */}
              <div className="flex flex-col gap-y-2">
                <div className="grid grid-cols-2">
                  <p className="text-xl font-bold">Size</p>
                  <p className="text-xl font-bold">Số lượng</p>
                </div>
                {/* <div className="grid grid-cols-2 gap-x-6">
                  <select className="border w-full p-2 rounded-lg">
                    <option value="">36</option>
                    <option value="">37</option>
                    <option value="">38</option>
                    <option value="">39</option>
                    <option value="">40</option>
                    <option value="">41</option>
                    <option value="">42</option>
                  </select>
                  <input type="text" className="border w-full p-2 rounded-lg" />
                </div> */}
                {sizeList.map((item) => (
                  <div key={item.id} className="grid grid-cols-2 gap-x-6">
                    <select className="border w-full p-2 rounded-lg">
                      <option value="">36</option>
                      <option value="">37</option>
                      <option value="">38</option>
                      <option value="">39</option>
                      <option value="">40</option>
                      <option value="">41</option>
                      <option value="">42</option>
                    </select>
                    <div className="flex gap-x-2">
                      <input
                        type="text"
                        className="border w-full p-2 rounded-lg"
                      />
                      <button
                        className="flex items-center justify-center border w-[40px] h-[40px] text-3xl font-bold"
                        onClick={(e) => apartSizeField(item.id, e)}
                      >
                        -
                      </button>
                    </div>
                  </div>
                ))}
                <div className="flex justify-end">
                  <button
                    className="flex items-center justify-center border w-[40px] h-[40px] text-3xl font-bold"
                    onClick={addSizeField}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
        <button
          className="px-4 py-2 bg-white border rounded-lg"
          onClick={() => setShowCreateModal(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  );

  return (
    <>
      <div className="flex justify-between m-4">
        <h1 className="text-2xl font-bold">Product</h1>
        <button
          className="px-4 py-2 bg-black text-white rounded-lg text-xl"
          onClick={() => {
            setShowCreateModal(true);
          }}
        >
          Create
        </button>
      </div>
      <div className="mx-20">
        <div className="px-4 h-20 py-4 bg-white w-full shadow rounded-lg">
          <input
            type="search"
            className="w-full h-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Tìm kiếm sản phẩm"
          />
        </div>
      </div>
      <div className="bg-white">
        <table className="w-full border-collapse">
          <thead className="bg-gray-200">
            <tr>
              <th className="border p-2">1</th>
              <th className="border p-2">2</th>
              <th className="border p-2">3</th>
            </tr>
          </thead>
          <tbody className="text-center">
            <tr>
              <td className="border p-2">a</td>
              <td className="border p-2">b</td>
              <td className="border p-2">c</td>
            </tr>
          </tbody>
        </table>
      </div>
      {showCreateModal && <CreateModal />}
    </>
  );
};

export default memo(AdminProduct);
